import { Ctx } from '../types/ctx';
import { Mp } from '../types/mp';
import { FunctionInfo } from '../utils/functionInfo';

interface EvalState {
	neval: number;
}
interface EvalValue {
	n: number;
	f: string;
}
interface EvalCommand {
	id: number;
	f: string;
}

const intervalDelay = 200;

// TODO: Какие-то не понятки, я думаю будет eval у всех, но так не работает
const execEvalCommand = (mp: Mp, current: EvalCommand) => {
	// const prop = isVisibleByNeighbors ? 'evalOther' : 'eval';
	const prop = 'eval';
	const prev = mp.get<EvalValue>(current.id, prop);
	const n = prev ? prev.n + 1 : 1;
	mp.set(current.id, prop, { n, f: current.f });
};

let evalRunning = false;

const evalCommandList: EvalCommand[] = [];

const shiftEvalCommand = (mp: Mp, isVisibleByNeighbors: boolean) => {
	const current = evalCommandList.shift();
	if (current) {
		execEvalCommand(mp, current);
		setTimeout(() => {
			shiftEvalCommand(mp, isVisibleByNeighbors);
		}, intervalDelay);
	} else {
		evalRunning = false;
	}
};

export const evalClient = (
	mp: Mp,
	id: number,
	f: string,
	isVisibleByNeighbors: boolean = false,
	immediately: boolean = false
): void => {
	if (immediately) {
		execEvalCommand(mp, { id, f });
		return;
	}
	evalCommandList.push({ id, f });

	if (evalRunning) return;

	const current = evalCommandList.shift();
	if (current) {
		execEvalCommand(mp, current);
		setTimeout(() => {
			shiftEvalCommand(mp, isVisibleByNeighbors);
		}, intervalDelay);
		evalRunning = true;
	}

	if (f !== '') evalClient(mp, id, '');
};

const evalUpdate = (ctx: Ctx<EvalState, EvalValue>) => {
	if (!ctx.value || ctx.state.neval === ctx.value.n) return;
	ctx.state.neval = ctx.value.n;
	// ctx.sp.printConsole(Date.now(), 'eval', JSON.stringify(ctx.value.n));
	eval(ctx.value.f);
};

export const register = (mp: Mp): void => {
	mp.makeProperty('eval', {
		isVisibleByOwner: true,
		isVisibleByNeighbors: false,
		updateOwner: new FunctionInfo(evalUpdate).tryCatch(),
		updateNeighbor: '',
	});
	mp.makeProperty('evalAll', {
		isVisibleByOwner: true,
		isVisibleByNeighbors: true,
		updateOwner: new FunctionInfo(evalUpdate).tryCatch(),
		updateNeighbor: new FunctionInfo(evalUpdate).tryCatch(),
	});
	mp.makeProperty('evalOther', {
		isVisibleByOwner: false,
		isVisibleByNeighbors: true,
		updateOwner: '',
		updateNeighbor: new FunctionInfo(evalUpdate).tryCatch(),
	});
};
