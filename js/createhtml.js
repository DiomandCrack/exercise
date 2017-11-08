
const vari ={

    conRow:document.querySelector('.container .row'),
    container:document.querySelector('.container'),
    breadCrumbNav:document.querySelector('.bread-crumb'),
    currentId:0,
    checkAll:document.querySelector('.check-all i'),
    checkedBuffer:{
	length:0
    },
    subNav: document.querySelector('.sub-nav'),
    btnRename: document.getElementById('btn-rename'),
    offlineDownload:document.querySelector('.off-line-download'),
    alertBox:document.querySelector('.alert-box')
};

//�����ļ��нڵ�
function createFileNode(fileData){
	let file = document.createElement('div');
	file.className = 'col-1';
	 file.innerHTML =`<div class="file-con">
                       <i class="fa fa-check true file-true"  aria-hidden="true"></i>
                        <div class="file">
                            <div class="grey-file"></div>
                            <div class="main-file"></div>
                        </div>
                        <div class="file-title show">${fileData.name}</div>
                        <div class="rename">
                            <input name="" type="text" value="${fileData.name}"/>
                       <i class="fa fa-check yes"  aria-hidden="true"></i>
<i class="fa fa-times no" aria-hidden="true"></i>
                        </div>
                    </div>
                    `;

    
    let fileItems = file.querySelectorAll('div');
    //�������е�id��ֵ���ļ��е�ÿһ����ɲ���
	for(let i=0; i<fileItems.length; i++){
	    fileItems[i].fileId = fileData.id;
	}
    file.fileId = fileData.id;
    console.log(fileItems[0].fileld);
    return file;//���������ļ��нڵ�
}

//�������м�����ڵ�
function createBreadCrumbNode(fileData){
    const crumbList = document.createElement('li');
    const href = document.createElement('a');

    href.fileId = fileData.id;
    href.innerHTML = `<i>&gt;</i> ${fileData.name}`;//�������м����html
    href.href = 'javascript:;';
    crumbList.appendChild(href);
    return crumbList;
}

//�����ļ���
function createFileList(db,id){
    vari.conRow.innerHTML = '';
    let children = getChildrenById(db,id);
    vari.childrenAll = children;
    vari.fileNum = children.length;
    children.forEach(function(item,i){
	vari.conRow.appendChild(createFileNode(item));
    });
}

//�������м����
function createBreadCrumb(db,id){
    vari.breadCrumbNav.innerHTML = '';
    var data = getAllParen(db,id);
    data.forEach(function(item,i){
	vari.breadCrumbNav.appendChild(createBreadCrumbNode(item));
    });
    
}

openFile(dataBase,vari.currentId);

//�������ļ��к͵�������һ��
function openFile(db,currentId){
    createFileList(db,currentId);
    createBreadCrumb(db,currentId);
}

//��ѡ
function showCheckNode(checkNode){

    const targetParent = checkNode.parentNode.parentNode; //�����Ԫ�صĸ����ĸ��� �ܸı��ļ��м�����ʽ������
    
    const {fileId} = targetParent; //targetParent.fileId = fileId;
    const checked = targetParent.classList.toggle('active'); // 

    const{checkedBuffer,checkAll,conRow} = vari;
    
    if(checked){
	checkedBuffer[fileId] = targetParent;
	checkedBuffer.length++;
    }
    else{
	delete checkedBuffer[fileId];
	checkedBuffer.length--;
    }
    console.log(checkedBuffer.length);
    checkAll.classList.toggle('active',checkedBuffer.length===vari.fileNum);
};

// ȫѡ��ť�ڵ�
function checkAllNode(single){
    const {childrenAll,checkAll,checkedBuffer} = vari;
    const allFiles = vari.conRow.children;
    
    single.classList.toggle('active');
    
    if(single.classList.contains('active')){
	vari.checkedBuffer = {length:0};
	
	childrenAll.forEach(function(item){
	    vari.checkedBuffer[item.id] = item;
	});
	console.log(checkedBuffer);
	
	vari.checkedBuffer.length = childrenAll.length;
	
	[...allFiles].forEach(function (item){
	    item.classList.add('active');
	});
	showSubNav();
    }else{
	vari.checkedBuffer = {length:0};
		[...allFiles].forEach(function (item){
	    item.classList.remove('active');
		});
	showSubNav();
    }
}

//��ʾ�����ư�ť
function showSubNav(){
    const {checkedBuffer} = vari;
    const length = checkedBuffer.length;
    if(length>=1){
	vari.offlineDownload.style.display ='none';
	vari.subNav.style.display = 'flex';
    }else{
	vari.offlineDownload.style.display='block';
	vari.subNav.style.display = 'none';
    }

    vari.btnRename.classList.toggle('disable',length !==1);
    }

//����¼�
vari.container.addEventListener('click',function(e){
    const target = e.target;
    if(target.classList.contains('main-file') || target.classList.contains('grey-file') || target.classList.contains('file-title')){
	openFile(dataBase,vari.currentId = target.fileId);
    }
    // console.log(target);
    if(target.classList.contains('file-true')){ //������ѡ��ť
	showCheckNode(target);
	showSubNav();
    }
    if(target.parentNode.classList.contains('check-all')){//����ȫѡ��ť
	checkAllNode(target);
    }

    // console.log(vari.checkedBuffer);
    
});

vari.breadCrumbNav.addEventListener('click',function(e){
    const target = e.target;
    if(target.fileId !==undefined && vari.cuurentId !== target.fileId){
	openFile(dataBase,vari.currentId = target.fileId);
    }
});
vari.btnRename.addEventListener('click',function(){
    const {checkedBuffer} = vari;
    const length = checkedBuffer.length;
    setFileTitle(checkedBuffer);
    right.removeEventListener('click',renameRule);
    wrong.removeEventListener('click',toggleWrong);
});
//������
function setFileTitle(checkedBuffer){
    const checkedEle = getSelectElement(checkedBuffer)[0];
    const {fileId,fileNode} = checkedEle;
    let repeat = 1;
    const nameText = fileNode.querySelector('.file-title');
    const nameChange = fileNode.querySelector('.rename');
    let nameInput = nameChange.querySelector('input');
    const shade = document.querySelector('.huge-shade');
    const right = nameChange.querySelector('.yes');
    const wrong = nameChange.querySelector('.no');
    switchName(nameChange,nameText,'show');
    
    nameInput.vaule = nameText.innerHTML;
    console.log(nameInput.vaule,nameInput);
    const initName = nameText.innerHTML;

    nameInput.focus();
    nameInput.select();
    shade.style.transform = 'scale(1)';
    //���������������¼�����
    function renameRule(){
		 shade.style.transform = '';
	let newName = nameInput.value.trim();	
	if(!newName){
	    nameInput.focus();
	    return alertMessage('�ļ�(��)���Ʋ���Ϊ�գ��������ļ�����','error');
	}
	if(newName === initName){
	    return switchName(nameText,nameChange,'show');
	}
	if(!nameConflict(dataBase,vari.currentId,newName)){
	    nameText.innerHTML = nameInput.value  + `(${repeat})`;
	    repeat++;
	    return switchName(nameText,nameChange,'show');
	}
	nameText.innerHTML = nameInput.value;

	switchName(nameText,nameChange,'show');
    }
//�رհ�ť������
    function toggleWrong(){
	 shade.style.transform = '';
	console.log(1);
	switchName(nameText,nameChange,'show');
    }
    
    right.addEventListener('click',renameRule);
  
    wrong.addEventListener('click',toggleWrong);
}

//input��title�л���ʾ���غ���
function switchName(show,hidden,classType){
    show.classList.add(classType);
    hidden.classList.remove(classType);
}
//��ѡ�е�Ԫ�ػ���ת������
function getSelectElement(checkedBuffer){

    let data = [];
    for(let key in checkedBuffer){
	if(key !== 'length'){
	    const currentItem = checkedBuffer[key];

	    data.push({
		fileId: key,
		fileNode: currentItem
	    });
	}
    }
    return data;
}

//��ʾ��
function alertMessage(text,type){
    console.log(vari.alertBox);
    vari.alertBox.innerHTML= text;
    vari.alertBox.classList.add(type);
    animation({
	el:vari.alertBox,
	attrs:{
	    top: 100
	},
	cb(){
	    alertMessage.timer =setTimeout(function(){
	    animation({
	el:vari.alertBox,
	attrs:{
	    top: -50
	}
	    });		
	},2000);
	    }
    });
}




