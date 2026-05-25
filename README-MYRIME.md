# my_rime Integration

This project now includes an online web-based IME powered by [my_rime](https://github.com/LibreService/my_rime).

## What is my_rime?

my_rime is a Free and Open Source online Chinese Input Method Editor (IME) powered by RIME, compiled to WebAssembly. It allows users to use the RIME input method directly in their web browser without any installation.

## Features

- 🌐 **Web-based**: Access the IME directly from your browser
- 🔒 **Privacy-focused**: All processing happens locally in the browser
- ⚡ **Fast**: Powered by WebAssembly for near-native performance
- 🎯 **RIME-compatible**: Uses the same schemas and configurations as desktop RIME
- 📱 **Cross-platform**: Works on any device with a modern web browser

## Usage

### Online Version

Visit the GitHub Pages deployment:
- Main page: `https://[username].github.io/rime-snomiao/`
- Direct IME access: `https://[username].github.io/rime-snomiao/myrime/`

### Local Development

To test the integration locally:

1. The CI/CD workflow will automatically build and deploy my_rime
2. Your rime-snomiao configurations from the `Rime/` directory are automatically copied to the web version
3. Access the IME at the `/myrime/` path

## How It Works

The GitHub Actions workflow (`.github/workflows/deploy-myrime.yml`) performs the following steps:

1. **Clone repositories**: Checks out both rime-snomiao and my_rime
2. **Install dependencies**: Sets up Node.js, pnpm, and system libraries
3. **Build my_rime**:
   - Downloads required fonts
   - Builds native components
   - Compiles schemas
   - Builds libraries
   - Compiles to WebAssembly using emsdk
   - Builds the web application
4. **Integrate configs**: Copies rime-snomiao configurations to the web version
5. **Deploy**: Publishes to GitHub Pages

## Configuration

Your existing RIME configurations in the `Rime/` directory are automatically included in the web version. This means:

- All your custom schemas (Japanese, Wubi, Pinyin, etc.) work in the browser
- Custom dictionaries are available
- Your preferred settings are applied

## Customization

To customize the my_rime integration:

1. **Landing page**: Edit `index.html` to change the appearance
2. **RIME configs**: Modify files in `Rime/` directory
3. **Build process**: Adjust `.github/workflows/deploy-myrime.yml`

## Credits

- [my_rime](https://github.com/LibreService/my_rime) - Free and Open Source online Chinese IME
- [RIME](https://rime.im/) - The underlying input method engine
- [Emscripten](https://emscripten.org/) - WebAssembly compilation toolchain

## License

The my_rime integration follows the same Copyleft principles as the main rime-snomiao project.
