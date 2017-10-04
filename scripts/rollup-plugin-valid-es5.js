export default function () {
    return {
        name: 'valid-es5',
        transformBundle(code) {
            removeComments(code).match(/[\w\=\>]+/g).forEach(word => {
                switch (word) {
                case 'const':
                case 'let':
                case '=>':
                    throw new Error(word + ' is not valid ES5 syntax');
                }
            });
            return code;
        }
    };
}

function removeComments(code) {
    // Remove comments block comments
    code = code.replace(/\/\*\*[\w\s*\.@{}|<>,=()[\];\/\-'`":]+\*\//g, '');
    // Remove inline comments
    code = code.replace(/\/\/.+\n/g, '\n');
    return code;
}