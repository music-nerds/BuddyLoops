const path = require("path");

module.exports = {
  mode: "development",
  entry: path.join(__dirname, '/src/app.tsx'),
  output: {
    filename: 'main.js',
    path: path.join(__dirname, './dist')
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3000
  },
  resolve: {
    extensions: [
      '.ts', '.tsx', '.js', '.jsx'
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
          
        ],
      },
      {
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          esModule: false,
        }
      }
    ]
  }
}