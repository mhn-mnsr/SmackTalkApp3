let potato = (str,callback) => {
    callback
    console.log(str)
}

potato('im a string',
    console.log('im another string')
)