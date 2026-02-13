#!/bin/bash

# TSC Hook – runs type checking after Claude stops editing
# Detects which app was modified and runs tsc there

CLAUDE_PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
HOOK_INPUT=$(cat)
TOOL_NAME=$(echo "$HOOK_INPUT" | jq -r '.tool_name // ""')
TOOL_INPUT=$(echo "$HOOK_INPUT" | jq -r '.tool_input // {}')

# Extract the app name from a file path (e.g. apps/web -> web)
get_app_for_file() {
    local file_path="$1"
    local relative_path="${file_path#$CLAUDE_PROJECT_DIR/}"

    if [[ "$relative_path" =~ ^apps/([^/]+)/ ]]; then
        local app="${BASH_REMATCH[1]}"
        local app_path="$CLAUDE_PROJECT_DIR/apps/$app"
        if [ -f "$app_path/tsconfig.json" ]; then
            echo "$app"
            return 0
        fi
    fi
    echo ""
    return 1
}

# Only process file modification tools
case "$TOOL_NAME" in
    Write|Edit|MultiEdit)
        if [ "$TOOL_NAME" = "MultiEdit" ]; then
            FILE_PATHS=$(echo "$TOOL_INPUT" | jq -r '.edits[].file_path // empty')
        else
            FILE_PATHS=$(echo "$TOOL_INPUT" | jq -r '.file_path // empty')
        fi

        # Collect apps that need checking (only for TS/JS files)
        APPS_TO_CHECK=$(echo "$FILE_PATHS" | grep -E '\.(ts|tsx|js|jsx)$' | while read -r file_path; do
            if [ -n "$file_path" ]; then
                app=$(get_app_for_file "$file_path")
                [ -n "$app" ] && echo "$app"
            fi
        done | sort -u | tr '\n' ' ')

        APPS_TO_CHECK=$(echo "$APPS_TO_CHECK" | xargs)

        if [ -n "$APPS_TO_CHECK" ]; then
            ERROR_COUNT=0
            ERROR_OUTPUT=""

            for app in $APPS_TO_CHECK; do
                echo -n "TypeScript check: apps/$app... " >&2
                APP_PATH="$CLAUDE_PROJECT_DIR/apps/$app"

                CHECK_OUTPUT=$(cd "$APP_PATH" && npx tsc --noEmit 2>&1)
                CHECK_EXIT_CODE=$?

                if [ $CHECK_EXIT_CODE -ne 0 ] || echo "$CHECK_OUTPUT" | grep -q "error TS"; then
                    echo "errors found" >&2
                    ERROR_COUNT=$((ERROR_COUNT + 1))
                    ERROR_OUTPUT="${ERROR_OUTPUT}

=== Errors in apps/$app ===
$CHECK_OUTPUT"
                else
                    echo "OK" >&2
                fi
            done

            if [ $ERROR_COUNT -gt 0 ]; then
                {
                    echo ""
                    echo "TypeScript errors:"
                    echo "$ERROR_OUTPUT" | grep "error TS" | head -10
                    TOTAL=$(echo "$ERROR_OUTPUT" | grep -c "error TS")
                    if [ "$TOTAL" -gt 10 ]; then
                        echo "... and $((TOTAL - 10)) more errors"
                    fi
                } >&2
                exit 1
            fi
        fi
        ;;
esac

exit 0
