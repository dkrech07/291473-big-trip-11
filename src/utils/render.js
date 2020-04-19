const RENDER_POSITION = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, component, place) => {
  switch (place) {
    case RENDER_POSITION.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RENDER_POSITION.BEFOREEND:
      container.append(component.getElement());
      break;
    case RENDER_POSITION.AFTEREND:
      container.after(component.getElement());
      break;
  }
};

const replace = (parent, newElement, oldElement) => {
  parent.replaceChild(newElement, oldElement);
};

const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export {
  RENDER_POSITION,
  createElement,
  render,
  replace,
  remove
};
