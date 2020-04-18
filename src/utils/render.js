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

const render = (container, element, place) => {
  switch (place) {
    case RENDER_POSITION.AFTERBEGIN:
      container.prepend(element);
      break;
    case RENDER_POSITION.BEFOREEND:
      container.append(element);
      break;
    case RENDER_POSITION.AFTEREND:
      container.after(element);
      break;
  }
};

export {
  RENDER_POSITION,
  createElement,
  render
};
