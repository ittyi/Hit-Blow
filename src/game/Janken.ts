
import { printLine, promptInput, promptSelect } from '../commonn/console';

import { Game } from '../domain/game/interface';
import { jankenOptions, JankenOption } from "../domain/janken/interface";

export class Janken implements Game {
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
