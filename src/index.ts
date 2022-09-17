const sayHello = (name: string) => {
	return `Hello, ${name}!`
}

// console.log(sayHello('Ittyi'))
process.stdout.write(sayHello('Ittyi'))