/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly REACT_APP_AWS_BACKEND_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
