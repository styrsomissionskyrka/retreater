module.exports = {
  plugin: (schema, documents, config) => {
    const types = schema.getTypeMap();

    const enumTypes = [];

    for (let [key, type] of Object.entries(types)) {
      if (type.astNode?.kind === 'EnumTypeDefinition') {
        enumTypes.push(key);
      }
    }

    return enumTypes.map(buildTypeGuard).join('\n').trim();
  },
};

function buildTypeGuard(enumName) {
  return `const __${enumName}__values = Object.values(${enumName});
export function is${enumName}(value: any): value is ${enumName} {
  return __${enumName}__values.includes(value)
}
export function ensure${enumName}(value: any, fallback: ${enumName}): ${enumName} {
  return is${enumName}(value) ? value : fallback;
}`.trim();
}
