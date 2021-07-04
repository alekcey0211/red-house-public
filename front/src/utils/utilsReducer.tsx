
type itemType = {
    item: Object,
    inventoryToAdd: Array<any>,
    inventoryToRemove: Array<any>,
    count: Number,
}


const changeCraftInventory = (inventory, data, count, change) => {
    const itemAddIndex = inventory.findIndex((item) => {
        if (item.active) {
            if (item.data.id === data.id) return true
        }

    })
    let newInventory
    if (itemAddIndex === -1) {//нет объекта в списке
        const index = inventory.findIndex((item) => !item.active)
        const newData = {
            active: true,
            data: {
                ...data,
                count: count
            }
        }
        inventory.splice(index, 1, newData)
        const newInventory = inventory
        return newInventory
    }
    else {
        if (change === 'add') {
            newInventory = inventory.map((item) => {
                if (item.active) {
                    if (item.data.id === data.id) {
                        return {
                            ...item,
                            data: {
                                ...data,
                                count: item.data.count + count
                            }

                        }

                    }
                    else return item
                }
                else return item

            })
            return newInventory
        }
    }
}

const changeInventoryStandart = (inventory: Array<any>, data: any, count: Number, change: String) => {
    const itemAddIndex = inventory.findIndex((item) => item.id === data.id)
    let newInventory
    if (itemAddIndex === -1) { //нет объекта в списке
        if (change === 'add') {
            const newData = {
                ...data,
                count: count
            }
            
            const newInventory = inventory.concat(newData)
            return newInventory
        }
        else if (change === 'remove') {

        }
    }
    else { //объект есть в списке
        if (change === 'remove') {// удаляем элемент из списка
            if (inventory[itemAddIndex].count === 1 || inventory[itemAddIndex].count === (- count)) {
                return inventory.filter((item, index) => index !== itemAddIndex)
            }
            else {
                newInventory = inventory.map((item) => {
                    if (item.id === data.id) {
                        return {
                            ...item,
                            count: item.count + count
                        }

                    }
                    else return item
                })
                return newInventory
            }
        }
        else if (change === 'add') {
            newInventory = inventory.map((item) => {
                if (item.id === data.id) {
                    return {
                        ...item,
                        count: item.count + count
                    }

                }
                else return item
            })
            return newInventory
        }
    }

}
const findItemIndex = (item, data) => {
    item.id === data.id
}

//TODO: добавить категории - стандарт, крафт
export const changeInventory = (item, inventoryToRemove, inventoryToAdd, count,) => {
    const data = item
    const countAdd = count
    const countRemove = - count
    let newInventoryToAdd
    let newInventoryToRemove

    if (inventoryToRemove.findIndex((item) => item.id === data.id) !== -1) {
        newInventoryToAdd = changeInventoryStandart(inventoryToAdd, data, countAdd, 'add')
        newInventoryToRemove = changeInventoryStandart(inventoryToRemove, data, countRemove, 'remove')
    }
    else {
        newInventoryToAdd = inventoryToAdd
        newInventoryToRemove = inventoryToRemove
    }



    return [newInventoryToRemove, newInventoryToAdd]
}

