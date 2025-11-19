import fs from "fs";
import path from "path";

/**
 * Update Storybook story imports to use workspace package instead of local components
 * Changes:
 * - @/components/ui/[component] -> @civictechmy/myds-react/[component]
 * - @/lib/utils -> @civictechmy/myds-react/utils
 * - @/components/ui/icon -> @civictechmy/myds-react/icon
 */

const STORIES_DIR = path.join(__dirname, "../apps/storybook/stories");

function log(message: string) {
  console.log(`✏️  ${message}`);
}

function updateStoryFile(filePath: string): boolean {
  const content = fs.readFileSync(filePath, "utf-8");
  let updated = content;
  let hasChanges = false;

  // Update component imports from @/components/ui/[component] to @civictechmy/myds-react/[component]
  const componentImportRegex = /from\s+["']@\/components\/ui\/([^"']+)["']/g;
  if (componentImportRegex.test(content)) {
    updated = updated.replace(
      /from\s+["']@\/components\/ui\/([^"']+)["']/g,
      'from "@civictechmy/myds-react/$1"'
    );
    hasChanges = true;
  }

  // Update utils imports from @/lib/utils to @civictechmy/myds-react/utils
  if (content.includes("@/lib/utils")) {
    updated = updated.replace(/from\s+["']@\/lib\/utils["']/g, 'from "@civictechmy/myds-react/utils"');
    hasChanges = true;
  }

  // Update import examples in comments and documentation
  const commentImportRegex = /from\s+["']@\/components\/ui\/([^"']+)["']/g;
  if (commentImportRegex.test(updated)) {
    updated = updated.replace(
      /from\s+["']@\/components\/ui\/([^"']+)["']/g,
      'from "@civictechmy/myds-react/$1"'
    );
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, updated);
    return true;
  }

  return false;
}

function main() {
  console.log("🔄 Updating Storybook story imports to use workspace package\n");

  const files = fs.readdirSync(STORIES_DIR).filter((file) => file.endsWith(".stories.tsx"));

  let updatedCount = 0;

  for (const file of files) {
    const filePath = path.join(STORIES_DIR, file);
    const wasUpdated = updateStoryFile(filePath);

    if (wasUpdated) {
      log(`Updated: ${file}`);
      updatedCount++;
    }
  }

  console.log(`\n✅ Updated ${updatedCount} story files`);
  console.log(`   Checked ${files.length} total story files`);
}

main();
