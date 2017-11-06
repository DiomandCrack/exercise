//通过id找到文件夹
function getDateById(db,id){
    return db[id];
}

//获取文件夹为id中的所有子级
function getChildrenById(db,id){
    let data = [];
    for(let key in db){
	let item = db[key]; //key是枚举的每个属性子级 item每个属性的子级对象
	if(item.pId === id){//如果子级的pId等于查找的id 就添加到data临时数组中
	    data.push(item);
	}
    }
    console.log(data);
    return data;
}

// getChildrenById(dataBase,0);

//找到一个文件夹的父级 一直搜索到根目录

function getAllParen(db,id){
    let current = db[id];
    let data = [];

    if(current){//根目录没有父级
	data.push(current);
	data = getAllParen(db,current.pId).concat(data);
    }
    return data;
}

// console.log(getAllParen(dataBase,4));

// 根据指定id删除对应的数据

function deleteDataById (db,id) {
    if(!id) return; //根目录不能删除
    
    delete db[id];
    let current = getChildrenById(db,id);
    let len =  current.length;
    if(len){ //如果当前文件夹有子文件的话
	for(let i =0; i<len; i++){
	    deleteDataById(db,current[i].id);
	}
    }

    return;
}
// deleteDataById(dataBase,2);
// console.log(dataBase);
