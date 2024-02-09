export function createElement(tagname: keyof HTMLElementTagNameMap) {
  return document.createElement(tagname)
}
