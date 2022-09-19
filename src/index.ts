/* abstract class */
abstract class Game {
	abstract setting(): Promise<void>
	abstract play(): Promise<void>
	abstract end(): void
}

/* common feature */
const printLine = (text: string, breakLine: boolean = true) => {
	return process.stdout.write(text + (breakLine ? `\n`: ''))
}

const promptInput = async (text: string) => {
	printLine(`\n${text}\n`, false);
	return readLine();
}

const readLine = async () => {
	const input: string = await new Promise(
		(resolve) => process.stdin.once(
			'data',
			(data) => resolve(data.toString()) 
		)
	)
	return input.trim()
}

const promptSelect = async <T extends string>(text: string, values: readonly T[]): Promise<T> => {
	printLine(`\n${text}`);
	values.forEach((value) => {
		printLine(`- ${value}`);
	})

	printLine(`> `, false);

	const input = await readLine() as T;
	if (values.includes(input)) {
		return input;
	} else {
		return promptSelect<T>(text, values);
	}
}

const nextActions = ['play again', 'change game', 'exit'] as const;
type NextAcion = typeof nextActions[number];

const gameTitles = ['hit and blow', 'janken'] as const;
type GameTitle = typeof gameTitles[number];

type GameStore = {
	[key in GameTitle]: Game
}

class GameProcedure {
	private currentGameTitle: GameTitle | '' = '';
	private currentGame: Game | null = null;

	constructor(private readonly gameStore: GameStore) {}

	public async start() {
		await this.select();
		await this.play();
	}
	private async select() {
		this.currentGameTitle =
			await promptSelect<GameTitle>('ゲームのタイトルを選択してください', gameTitles);
		this.currentGame = this.gameStore[this.currentGameTitle];
	}

	private async play() {
		if (this.currentGame == null) throw new Error('ゲームが選択されていません。');

		printLine(`~~~\n${this.currentGameTitle} を開始します。\n~~~`);
		await this.currentGame.setting();
		await this.currentGame.play();
		this.currentGame.end();
		
		const action = await promptSelect<NextAcion>('ゲームを続けますか？', nextActions);
		if (action === 'play again') {
			await this.play();
		} else if (action === 'change game') {
			await this.select();
			await this.play();
		}else if (action === 'exit') {
			this.end();
		} else {
			const neverVal: never = action;
			throw new Error(`${neverVal} is an invalid action.`);
		}
	}

	private end() {
		printLine('ゲームを終了しました。');
		process.exit();
	}
}

/* hit&blow */
const modes = ['normal', 'hard'] as const;
type Mode = typeof modes[number];


class HitAndBlow implements Game {
	private readonly answerSource: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	private answer: string[] = [];
	private tryCount: number = 0;
	private mode: Mode = 'normal';

	private getAnswerLength() {
		switch (this.mode) {
			case 'normal':
				return 3;
			case 'hard':
				return 4;
			default :
				const neverVal: never = this.mode;
				throw new Error(`${neverVal} は無効なモードです。`)
		}
	}

	async setting() {
		this.mode = await promptSelect<Mode>('モードを入力してください。', modes);
		while (this.answer.length < this.getAnswerLength()) {
			const randumNum = String(Math.floor( Math.random() * this.answerSource.length));
			if ((this.answer).includes(randumNum) === false) {
				this.answer.push(randumNum);
			}
		}
		console.log('answer:', this.answer);
	}

	private checkInputStr(inputNumStr: string[]) {
		if (inputNumStr.length != this.answer.length) {
			return false;
		}

		let checkErrerFlg = true;
		inputNumStr.forEach(element => {
			if (this.answerSource.includes(element) === false) {
				checkErrerFlg = false;
			}
			
			/// 配列中で inputNumStr[i] が最初/最後に出てくる位置を取得
			let firstIndex = inputNumStr.indexOf(element);
			let lastIndex = inputNumStr.lastIndexOf(element);

			if(firstIndex != lastIndex){
				checkErrerFlg = false;
			}
		});
		return checkErrerFlg;
	}

	async play() {
		let inputNumStr = (await promptInput(`「,」区切りで${this.getAnswerLength()}つの数字を入力してください`)).split(',');
		while (this.checkInputStr(inputNumStr) === false) {
			printLine('無効な入力です。')
			inputNumStr = (await promptInput(`「,」区切りで${this.getAnswerLength()}つの数字を入力してください`)).split(',');
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

	private check(input: string[]) {
		let hitCount = 0;
		let blowCount = 0;

		input.forEach((inputVal, index)=> {
			if (inputVal === this.answer[index]) {
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
		this.reset();
	}

	private reset() {
		this.answer = [];
		this.tryCount = 0;
	}
}

/* Janken */
const jankenOptions = ['rock', 'paper', 'scissors'] as const
type JankenOption = typeof jankenOptions[number]

class Janken implements Game {
	private rounds = 0
	private currentRound = 1
	private result = {
		win: 0,
		lose: 0,
		draw: 0,
	}

	async setting() {
		const rounds = Number(await promptInput('何本勝負にしますか？'))
		if (Number.isInteger(rounds) && 0 < rounds) {
			this.rounds = rounds
		} else {
			await this.setting()
		}
	}

	async play() {
		const userSelected = await promptSelect(`【${this.currentRound}回戦】選択肢を入力してください。`, jankenOptions)
		const randomSelected = jankenOptions[Math.floor(Math.random() * 3)]
		const result = Janken.judge(userSelected, randomSelected)
		let resultText: string

		switch (result) {
		case 'win':
			this.result.win += 1
			resultText = '勝ち'
			break
		case 'lose':
			this.result.lose += 1
			resultText = '負け'
			break
		case 'draw':
			this.result.draw += 1
			resultText = 'あいこ'
			break
		}
		printLine(`---\nあなた: ${userSelected}\n相手${randomSelected}\n${resultText}\n---`)

		if (this.currentRound < this.rounds) {
		this.currentRound += 1
		await this.play()
		}
	}

	end() {
		printLine(`\n${this.result.win}勝${this.result.lose}敗${this.result.draw}引き分けでした。`)
		this.reset()
	}

	private reset() {
		this.rounds = 0
		this.currentRound = 1
		this.result = {
			win: 0,
			lose: 0,
			draw: 0,
		}
	}

	static judge(userSelected: JankenOption, randomSelected: JankenOption) {
		if (userSelected === 'rock') {
		if (randomSelected === 'rock') return 'draw'
		if (randomSelected === 'paper') return 'lose'
		return 'win'
    } else if (userSelected === 'paper') {
		if (randomSelected === 'rock') return 'win'
		if (randomSelected === 'paper') return 'draw'
		return 'lose'	
    } else {
		if (randomSelected === 'rock') return 'lose'
		if (randomSelected === 'paper') return 'win'
		return 'draw'
    }
	}
}


// exec process
;(
	async function () {
		new GameProcedure({
			'hit and blow': new HitAndBlow(),
			'janken': new Janken(),
		}).start();
	}
)();

