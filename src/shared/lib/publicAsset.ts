/** Resolve public/ media relative to the document, including GitHub Pages subpaths. */
export function publicAsset(path: string) {
  return `./${path.replace(/^(?:\.\/|\/)+/, '')}`;
}
