import { preset } from "@civictechmy/myds-style";

export default {
  content: [
    "src/**/*.{js,jsx,ts,tsx}", // Your own project source files
    "node_modules/@civictechmy/myds-react/dist/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [preset],
};
