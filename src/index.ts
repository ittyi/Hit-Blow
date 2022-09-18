const printLine = (text: string, breakLine: boolean = true) => {
	return process.stdout.write(text + (breakLine ? `\n`: ''))
}

// printLine test code
printLine("hello");
printLine("my name is Ittyi!", false);
printLine("have nice day~~", false);


const promptInput = async (text: string) => {
	printLine(`\n${text}\n`, false)
	const input :string = await new Promise(// 非同期処理突入
		(resolve) => process.stdin.once('data', (data) => resolve(data.toString()))
	)

	return input.trim();
}

// promptInput test code
;(
	async () => {
		const name = await promptInput('Please enter your name');
		console.log(name);
		const age = await promptInput('Please enter your age');
		console.log(age);
	}
)();
