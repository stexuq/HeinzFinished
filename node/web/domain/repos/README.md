# repoBlueprint.js
The repoBlueprint provides a Blueprint to serve for interface adherance. All repos can be validated against this by declaring their blueprint (i.e. `module.exports.blueprint = ['repoBlueprint'];`). Adherance can be verified by using [sync or async validation](https://github.com/Acatar/hilaryjs/wiki/Blueprint#synchronous-validation)

Depending on the application, this may break the Interface Segregation Principle. Do you know why?
