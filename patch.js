/*
Patch function is for efficiency when building DOM since it allows the program to patch the nodes that were altered without having to rerender the whole DOM with every change.
The function compares different combinations of VDOM and DOM combinations and decides what part needs to be rendered:
Primitive VDOM with Text DOM: Checks DOM text and perform full render if VDOM value differs
Primitive VDOM with Element DOM: Full renders
Complex VDOM with Text DOM: Full renders
Complex VDOM with Element DOM of different type: Full render
Complex VDOM with Element DOM of same type: Performs the check of children nodes to patch or render specific parts
*/
const patch = (dom, vdom, parent = dom.parentNode) => {
  const replace = parent
    ? (el) => parent.replaceChild(el, dom) && el
    : (el) => el;
  if (typeof vdom == "object" && typeof vdom.type == "function") {
    return Component.patch(dom, vdom, parent);
  } else if (typeof vdom != "object" && dom instanceof Text) {
    return dom.textContent != vdom ? replace(render(vdom, parent)) : dom;
  } else if (typeof vdom == "object" && dom instanceof Text) {
    return replace(render(vdom, parent));
  } else if (
    typeof vdom == "object" &&
    dom.nodeName != vdom.type.toUpperCase()
  ) {
    return replace(render(vdom, parent));
  } else if (
    typeof vdom == "object" &&
    dom.nodeName == vdom.type.toUpperCase()
  ) {
    const pool = {};
    const active = document.activeElement;
    [
      /* flatten */
    ]
      .concat(...dom.childNodes)
      .map((child, index) => {
        const key = child.__gooactKey || `__index_${index}`;
        pool[key] = child;
      });
    [
      /* flatten */
    ]
      .concat(...vdom.children)
      .map((child, index) => {
        const key = (child.props && child.props.key) || `__index_${index}`;
        dom.appendChild(
          pool[key] ? patch(pool[key], child) : render(child, dom)
        );
        delete pool[key];
      });
    for (const key in pool) {
      const instance = pool[key].__gooactInstance;
      if (instance) instance.componentWillUnmount();
      pool[key].remove();
    }
    for (const attr of dom.attributes) dom.removeAttribute(attr.name);
    for (const prop in vdom.props) setAttribute(dom, prop, vdom.props[prop]);
    active.focus();
    return dom;
  }
};
