import React from 'react'
import { useSelector } from 'react-redux'

import Button from '/components/styled/button'

import './style.sass'

/**
 * Подвал интерфейса `CookingCraft`.
 * 
 * @param {object} props
 * @returns {JSX.Element}
 */
const CraftFooter = (props) => {

	/**
	 * Состояния/данные интерфейса.
	 */
	const { craftItems } = useSelector(state => state.craftReducer)
	const craftItemsCount = craftItems.filter((item) => item.active).length
	const { handlers } = props 

	return (
		<div className="craft__footer">
			<div className="craft__actions">
				<Button
					type="action"
					onClick={handlers.handlerToAccept}
					isActive={craftItemsCount > 0}
					triggerKey="E"
					description="Приготовить"
					style={{
						marginRight: '25px'
					}}
				></Button>
				
				<Button
					type="action"
					onClick={handlers.handlerClose}
					triggerKey="Esc"
					description="Отменить"
					style={{
						marginRight: '25px'
					}}
				></Button>
			</div>
		</div>
	)
}

export default CraftFooter
