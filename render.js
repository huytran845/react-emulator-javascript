/*
The render function is for differentiating the types of vdoms that could be passed in for rendering, such as primitives that deal with strings, bools, etc.
Complex VDOMs which have nodes of string type, and component VDOMs that have function type.
*/
const render = (vdom, parent = null) => {
  const mount = parent
    ? (el) => parent.appendChild(element1)
    : (element1) => element1;

  if (typeof vdom == "string" || typeof vdom == "number") {
    return mount(document.createTextNode(vdom));
  } else if (typeof vdom == "boolean" || vdom === null) {
    return mount(document.createTextNode(""));
  } else if (typeof vdom == "object" && typeof vdom.type == "function") {
    return Component.render(vdom, parent);
  } else if (typeof vdom == "object" && typeof vdom.type == "string") {
    const dom = mount(document.createElement(vdom.type));
    for (const child of [
      /* flattens the children array 1 level deep meaning there are less nested arrays */
    ].concat(...vdom.children))
      render(child, dom);
    for (const prop in vdom.props) setAttribute(dom, prop, vdom.props[prop]);
    return dom;
  } else {
    throw new Error(`Invalid VDOM: ${vdom}.`);
  }
};

/*
The setAttribute function is for assigning attributes based the passed in parameters for properties that the VDOM can accept.
*/
const setAttribute = (dom, key, value) => {
  if (typeof value == "function" && key.startsWith("on")) {
    const eventType = key.slice(2).toLowerCase();
    dom.__gooactHandlers = dom.__gooactHandlers || {};
    dom.removeEventListener(eventType, dom.__gooactHandlers[eventType]);
    dom.__gooactHandlers[eventType] = value;
    dom.addEventListener(eventType, dom.__gooactHandlers[eventType]);
  } else if (key == "checked" || key == "value" || key == "className") {
    dom[key] = value;
  } else if (key == "style" && typeof value == "object") {
    Object.assign(dom.style, value);
  } else if (key == "ref" && typeof value == "function") {
    value(dom);
  } else if (key == "key") {
    dom.__gooactKey = value;
  } else if (typeof value != "object" && typeof value != "function") {
    dom.setAttribute(key, value);
  }
};
