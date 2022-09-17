const printLine = (text: string, breakLine: boolean = true) => {
	return process.stdout.write(text + (breakLine ? `\n`: ''))
}


printLine("hello");
printLine("my name is Ittyi!", false);
printLine("have nice day~~", false);