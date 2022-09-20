import { printLine, promptInput, promptSelect } from '../common/console';

import { Game } from '../domain/game/interface';
import { Mode, modes } from "../domain/hitAndBlow/interface";
import { ANSWER_LENGTH } from "../domain/hitAndBlow/constant";

export class HitAndBlow implements Game {
	private readonly answerSource: string[] = [...Array(10)].map((_, i) => String(i));
	private answer: string[] = [];
	private tryCount = 0;
	private mode: Mode = 'normal';

	private getAnswerLength() {
		switch (this.mode) {
			case 'normal':
				return ANSWER_LENGTH.NORMAL;
			case 'hard':
				return ANSWER_LENGTH.HARD;
			default :
				const neverVal: never = this.mode;
				throw new Error(`${neverVal} は無効なモードです。`)
		}
	}

	async setting() {
		this.mode = await promptSelect<Mode>('モードを入力してください。', modes);
		while (this.answer.length < this.getAnswerLength()) {
			const randomNum = String(Math.floor( Math.random() * this.answerSource.length));
			if (this.answer.includes(randomNum) === false) {
				this.answer.push(randomNum);
			}
		}
		// console.log('answer:', this.answer);
	}

	private checkInputStr(inputNumStr: string[]) {
		if (inputNumStr.length !== this.answer.length) {
			return false;
		}

		let checkErrorFlg = true;
		inputNumStr.forEach(element => {
			if (this.answerSource.includes(element) === false) {
				checkErrorFlg = false;
			}

			/// 配列中で inputNumStr[i] が最初/最後に出てくる位置を取得
			const firstIndex = inputNumStr.indexOf(element);
			const lastIndex = inputNumStr.lastIndexOf(element);

			if(firstIndex != lastIndex){
				checkErrorFlg = false;
			}
		});
		return checkErrorFlg;
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
		printLine(`Congrats!! Trial Count: ${this.tryCount}`);
		this.reset();
	}

	private reset() {
		this.answer = [];
		this.tryCount = 0;
	}
}
