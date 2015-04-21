# Example files

These files are a sample application, running React and SmallFlux.

## Usage

Clone the repository

    git clone https://github.com/WelcomWeb/small-flux.git

Change working directory

    cd small-flux/examples

Install all dependencies from `npm`

    npm install

Compile and bundle the LESS and JavaScript files

    gulp

For production code, compile with `build` flag (and accordingly update the `index.html` to use these files)

    gulp build

If you don't have gulp installed globally, install it first with

    npm install -g gulp

Run the application

    pushd ./www; python -m SimpleHTTPServer; popd;

Point your browser to `http://localhost:8000` and you should be able to run the application!