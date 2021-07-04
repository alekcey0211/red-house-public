const save = (settings) => {
  switch (settings.type) {
    case "setting":
      localStorage.setItem(settings.type, JSON.stringify(settings));
      break;

    default:
      break;
  }
};

const load = (type) => JSON.parse(localStorage.getItem(type));

export default { save, load };
