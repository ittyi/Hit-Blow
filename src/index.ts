const printLine = (text: string, breakLine: boolean = true) => {
	return process.stdout.write(text + (breakLine ? `\n`: ''))
}

const promptInput = async (text: string) => {
	printLine(`\n${text}\n`, false)
	const input :string = await new Promise(// 非同期処理突入
		(resolve) => process.stdin.once('data', (data) => resolve(data.toString()))
	)
	return input.trim();
}

/* main class */
class HitAndBlow {
	private readonly answerSource: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	private answer: string[] = [];
	private tryCount: number = 0;

	setting() {
		while (this.answer.length < 3) {
			const randumNum = String(Math.floor( Math.random() * this.answerSource.length));
			if ((this.answer).includes(randumNum) == false) {
				this.answer.push(randumNum);
			}
		}
		console.log('answer:', this.answer);
	}

	async play() {
		let inputNumStr = (await promptInput('「,」区切りで３つの数字を入力してください')).split(',');
		while (this.checkInputStr(inputNumStr) == false) {
			inputNumStr = (await promptInput('「,」区切りで３つの数字を入力してください')).split(',');
		}
		const inputArr = inputNumStr;
		const result = this.check(inputArr);
		console.log(inputArr)
		console.log(result)
		if (result.hit >= this.answer.length) {
			this.tryCount += 1;
		} else {
			this.tryCount += 1;
			console.log('one more!', result)
			await this.play();
		}
	}

	checkInputStr(inputNumStr: string[]) {
		if (inputNumStr.length != this.answer.length) {
			return false;
		}
		let checkErrerFlg = true;
		inputNumStr.forEach(element => {
			if (this.answerSource.includes(element) == false) {
				checkErrerFlg = false;
			}

			/// 配列中で arr[i] が最初/最後に出てくる位置を取得
			let firstIndex = inputNumStr.indexOf(element);
			let lastIndex = inputNumStr.lastIndexOf(element);
			
			if(firstIndex != lastIndex){
				console.log('check')
				checkErrerFlg = false;
			}
		});
		return checkErrerFlg;
	}

	private check(input: string[]) {
		let hitCount = 0;
		let blowCount = 0;

		input.forEach((inputVal, index)=> {
			if (inputVal == this.answer[index]) {
				hitCount += 1;
			} else if (this.answer.includes(inputVal)) {
				blowCount += 1;
			}
		});

		return {
			hit: hitCount,
			blow: blowCount
		};
	}

	end() {
		printLine(`conglutts!! Trial Count: ${this.tryCount}`);
		process.exit();
	}
}

// exec process
;(
	async function () {
		const hitAndBlow = new HitAndBlow();
		hitAndBlow.setting();
		await hitAndBlow.play();
		hitAndBlow.end();
	}
)();

