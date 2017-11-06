//ͨ��id�ҵ��ļ���
function getDateById(db,id){
    return db[id];
}

//��ȡ�ļ���Ϊid�е������Ӽ�
function getChildrenById(db,id){
    let data = [];
    for(let key in db){
	let item = db[key]; //key��ö�ٵ�ÿ�������Ӽ� itemÿ�����Ե��Ӽ�����
	if(item.pId === id){//����Ӽ���pId���ڲ��ҵ�id ����ӵ�data��ʱ������
	    data.push(item);
	}
    }
    console.log(data);
    return data;
}

// getChildrenById(dataBase,0);

//�ҵ�һ���ļ��еĸ��� һֱ��������Ŀ¼

function getAllParen(db,id){
    let current = db[id];
    let data = [];

    if(current){//��Ŀ¼û�и���
	data.push(current);
	data = getAllParen(db,current.pId).concat(data);
    }
    return data;
}

// console.log(getAllParen(dataBase,4));

// ����ָ��idɾ����Ӧ������

function deleteDataById (db,id) {
    if(!id) return; //��Ŀ¼����ɾ��
    
    delete db[id];
    let current = getChildrenById(db,id);
    let len =  current.length;
    if(len){ //�����ǰ�ļ��������ļ��Ļ�
	for(let i =0; i<len; i++){
	    deleteDataById(db,current[i].id);
	}
    }

    return;
}
// deleteDataById(dataBase,2);
// console.log(dataBase);
