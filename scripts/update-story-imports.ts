import fs from "fs";
import path from "path";
import { glob } from "glob";

/**
 * Update all Storybook story imports from npm package to registry paths
 * Example:
 *   import { Button } from "@civictechmy/myds-react/button"
 *   → import { Button } from "@/components/ui/button"
 */

const STORIES_DIR = path.join(__dirname, "../apps/storybook/stories");

async function updateStoryImports() {
  console.log("🔄 Updating story imports...\n");

  // Find all story files
  const storyFiles = await glob("**/*.stories.{ts,tsx}", {
    cwd: STORIES_DIR,
    absolute: true,
  });

  console.log(`Found ${storyFiles.length} story files\n`);

  let filesUpdated = 0;

  for (const file of storyFiles) {
    let content = fs.readFileSync(file, "utf-8");
    const originalContent = content;

    // Update component imports from npm package to registry
    // Pattern: import { Component } from "@civictechmy/myds-react/component"
    // Replace: import { Component } from "@/components/ui/component"
    content = content.replace(
      /from\s+["']@civictechmy\/myds-react\/([^"']+)["']/g,
      'from "@/components/ui/$1"'
    );

    // Update utils imports
    content = content.replace(
      /from\s+["']@civictechmy\/myds-react\/utils["']/g,
      'from "@/lib/utils"'
    );

    // Update hooks imports
    content = content.replace(
      /from\s+["']@civictechmy\/myds-react\/hooks["']/g,
      'from "@/lib/hooks"'
    );

    // Update icon imports
    content = content.replace(
      /from\s+["']@civictechmy\/myds-react\/icon["']/g,
      'from "@/components/ui/icons"'
    );

    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`✓ Updated: ${path.relative(STORIES_DIR, file)}`);
      filesUpdated++;
    }
  }

  console.log(`\n✅ Updated ${filesUpdated} files`);
  console.log(`📁 Location: ${STORIES_DIR}`);
}

updateStoryImports().catch((error) => {
  console.error("❌ Update failed:", error);
  process.exit(1);
});
