const main = (resourceName) => {
  let camelCaseResourceName = '';
  let kebabCaseResourceName = '';
  let capitalizedResourceName = '';

  // Generate camelCase and kebabCase resource name
  if (resourceName.match(/[A-Z]+/)) {
    console.log('Resource name has uppercases');
    camelCaseResourceName = resourceName;
    kebabCaseResourceName = resourceName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase();
    capitalizedResourceName =
      camelCaseResourceName.charAt(0).toUpperCase() +
      camelCaseResourceName.slice(1);
  } else {
    console.log('Resource name has no uppercases');
    kebabCaseResourceName = resourceName;
    camelCaseResourceName = resourceName.replace(/-([a-z])/g, (g) =>
      g[1].toUpperCase()
    );
    capitalizedResourceName =
      camelCaseResourceName.charAt(0).toUpperCase() +
      camelCaseResourceName.slice(1);
  }

  return {
    camelCaseResourceName,
    kebabCaseResourceName,
    capitalizedResourceName,
  };
};

module.exports = main;
