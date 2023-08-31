import { Status } from "./modalFactory.js";

/**
 *
 * @param {string} str
 * @returns
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

export function createElem(tagName, className) {
  const elem = document.createElement(tagName);
  className && (elem.className = className);
  return elem;
}

export function appendChildren(parent, ...children) {
  children.forEach((child) => parent.append(child));
}

export function createButton(className, text, onClick) {
  const button = createElem("button", className);
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
}

export function buttonText(button, text) {
  button.textContent = text;
}

export function buttonDisabled(button, value) {
  button.disabled = value;
}

export function createStatusElements() {
  return [new Status("success"), new Status("failure")];
}

export function renderMessage(statusElem, message) {
  statusElem.render(message);
}

export function createElementFromString(elementString) {
  let range = document.createRange();
  return range.createContextualFragment(elementString).children[0];
}
