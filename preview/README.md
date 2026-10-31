# Standalone preview

No NPM packages required. Run from the project directory:

```bash
python -m http.server 5174
```

Visit `http://127.0.0.1:5174/preview/`.

This preview imports generated ESM geometry files (`preview/core/*`) compiled from the *same original TypeScript source* used by the React package. The interactive React/Vite gallery is in `demo/`.
