import { printLine, promptSelect } from './common/console';

import { HitAndBlow } from './game/HitAndBlow';
import { Janken } from './game/Janken';
import { Game } from './domain/game/interface';


const nextActions = ['play again', 'change game', 'exit'] as const;
type NextAction = typeof nextActions[number];

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
		if (this.currentGame === null) throw new Error('ゲームが選択されていません。');

		printLine(`~~~\n${this.currentGameTitle} を開始します。\n~~~`);
		await this.currentGame.setting();
		await this.currentGame.play();
		this.currentGame.end();

		const action = await promptSelect<NextAction>('ゲームを続けますか？', nextActions);
		if (action === 'play again') {
			await this.play();
		} else if (action === 'change game') {
			await this.select();
			await this.play();
		} else if (action === 'exit') {
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


// exec process
;(
	function () {
		new GameProcedure({
			'hit and blow': new HitAndBlow(),
			'janken': new Janken(),
		}).start();
	}
)();

