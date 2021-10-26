import { EspmField, Mp } from '../../types/mp';
import { float32, int32, uint16, uint8 } from '../../utils/helper';
import { hasKeywordEx } from '../form/keywords';
import { conditionFunctions } from './functionList';
import { ConditionResult, ConditionFlag, ConditionOperator } from './type';

export const conditionAllResult = (mp: Mp, conditionFields: EspmField[], subjectId: number): boolean => {
	const condResults: ConditionResult[] = [];
	conditionFields.forEach((cf) => {
		if (!cf) return;
		const result = conditionResult(mp, cf.data.buffer, subjectId);
		if (result === undefined) return;
		condResults.push(result);
	});
	// for (let i = 0; i < conditionFields.length; i++) {}
	if (condResults[0].flag === ConditionFlag.AND) {
		return condResults.every((c) => c.result);
	}
	if (condResults[0].flag === ConditionFlag.OR) {
		return condResults.some((c) => c.result);
	}
	return false;
};

export const conditionResult = (mp: Mp, cond: ArrayBufferLike, subjectId: number): ConditionResult | undefined => {
	const flags: ConditionFlag = uint8(cond.slice(0, 5), 0);
	const operator: ConditionOperator = uint8(cond.slice(5, 8), 0);
	const value = float32(cond, 4);
	const func = uint16(cond, 8);
	const param1 = int32(cond, 12);
	// console.log(
	//   flags & ConditionFlag.OR,
	//   operator,
	//   value,
	//   conditionFunctions[func],
	//   param1.toString(16),
	//   param2,
	//   runOn,
	//   ref
	// );
	if (operator === ConditionOperator.EqualTo) {
		// TODO: функции должны вызываться без условного выражения
		if (conditionFunctions[func] === 'HasKeyword') {
			const funcResult = hasKeywordEx(mp, null, [subjectId, param1]);
			const condResult = !!value === funcResult;
			return {
				// eslint-disable-next-line no-bitwise
				flag: flags & ConditionFlag.OR ? ConditionFlag.OR : ConditionFlag.AND,
				result: condResult,
			};
		}
	}
};
