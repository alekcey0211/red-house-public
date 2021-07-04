import React, { memo } from 'react';

/**
 * Пустой предмет крафта.
 * 
 * @param {object} props
 * @returns {JSX.Element}
 */
const CraftItemNullInner = (props) => {

	return (
		<div className="craft__item empty">
			<span className="index">{props.index + 1}</span>
		</div>
	)
	
}

export const CraftItemNull = memo(CraftItemNullInner);
