interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  [key: string]: any;
}

const config: CapacitorConfig = {
  appId: 'com.aistudio.documenteditor.abxzw2',
  appName: 'Word & Excel Editor',
  webDir: 'dist'
};

export default config;
