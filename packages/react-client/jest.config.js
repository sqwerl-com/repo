const config = {
    'moduleNameMapper': {
        '^d3$': '/node_modules/d3/dist/d3.min.js',
        '^react-dnd$': 'react-dnd/dist/cjs',
        '^react-dnd-html5-backend$': 'react-dnd-html5-backend/dist/cjs',
        '^dnd-core$': 'dnd-core/dist/cjs'
    },
    'transform': {
        '^.+\\.ts?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest'
    },
    transformIgnorePatterns: [
        '/node_modules/(?!d3|d3-array|d3-time|internmap|delaunator|robust-predicates)'
    ]
};
export default config;
