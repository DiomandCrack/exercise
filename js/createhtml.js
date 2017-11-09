
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
    alertBox:document.querySelector('.alert-box'),
    deleteBtn:document.getElementById('btn-delete'),
    body: document.querySelector('body'),
    prompt:document.createElement('div'),
    createNewFile:document.querySelector('.create-folder'),
    fileNum: 0,
    repeat:1
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
    const allFiles  = vari.conRow.children;
    const targetParent = checkNode.parentNode.parentNode; //�����Ԫ�صĸ����ĸ��� �ܸı��ļ��м�����ʽ������
    const length = [...allFiles].length;
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
    
    console.log(checkedBuffer);
    checkAll.classList.toggle('active',checkedBuffer.length===length);
};

// ȫѡ��ť�ڵ�
function checkAllNode(single){
    const {childrenAll,checkAll,checkedBuffer} = vari;
    const allFiles = vari.conRow.children;
    
    single.classList.toggle('active');
    
    if(single.classList.contains('active')){
	vari.checkedBuffer = {length:0};
	
	vari.checkedBuffer.length = childrenAll.length;
	
	[...allFiles].forEach(function (item){
	    item.classList.add('active');
	    vari.checkedBuffer[item.fileId] = item;
	    console.log(vari.checkedBuffer);
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

vari.btnRename.addEventListener('click',permitRename);


    function permitRename(){
	if(vari.checkedBuffer.length===1){
	    const {checkedBuffer} = vari;
	    const length = checkedBuffer.length;
	    setFileTitle(checkedBuffer,true);
	}else{
	    vari.btnRename.removeEventListener('click',permitRename);
	}
}

vari.deleteBtn.addEventListener('click',function(e){
    let target = e.target;
    vari.body.insertBefore(createPrompt('delete-box'),vari.alertBox);
    deleteFile();
});
vari.createNewFile.addEventListener('click',function(e){
    createFolder();
});
//������

function setFileTitle(checkedBuffer,boolean){
    const checkedEle = getSelectElement(checkedBuffer)[0];
    let fileId,fileNode;
    if(boolean){
	fileId = checkedEle.fileId;
	fileNode = checkedEle.fileNode;
    }else{
	 fileNode = checkedBuffer;
    }

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
	console.log(nameInput);
	
	 if(newName === initName && boolean){   return switchName(nameText,nameChange,'show');}
	if(!nameConflict(dataBase,vari.currentId,newName)){
	    console.log(1);
	    nameText.innerHTML = nameInput.value = nameInput.value  + `(${vari.repeat})`;
	    vari.repeat++;
	    createNewFolder(boolean);
	    
	    return switchName(nameText,nameChange,'show');
	}

	nameText.innerHTML = nameInput.value;

	createNewFolder(boolean);

	switchName(nameText,nameChange,'show');
    }
//�رհ�ť������
    function toggleWrong(){
	shade.style.transform = '';
	if(!boolean){
	    vari.conRow.removeChild(vari.conRow.children[0]);
	    	console.log(1);
	}

	switchName(nameText,nameChange,'show');
    }
    // right.removeEventListener('click',renameRule);
    // wrong.removeEventListener('click',toggleWrong);
    // right.addEventListener('click',renameRule);
    // wrong.addEventListener('click',toggleWrong);
    right.onclick = function(){
	renameRule(boolean);
    };
    wrong.onclick = function(){
	toggleWrong(boolean);
    };
}

//���������ú���
function createNewFolder(boolean){
		if(!boolean){
		    const newData =vari.conRow.children[0];
		    const name = newData.querySelector('.file-title');
		    console.log();
		    dataBase[newData.fileId.toString()] = {
			id: newData.fileId,
			pId: vari.currentId,
			name: name.innerHTML
		    };
		    vari.fileNum = vari.fileNum+1;
		}
    	if(boolean){
	    alertMessage('�޸����ֳɹ�','success');
	}else{
	    alertMessage('�����ļ��ɹ�','success');
	}
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
		fileId: parseFloat(key),
		fileNode: currentItem
	    });
	}
    }
    return data;
}

//��ʾ��
function alertMessage(text,type){
    clearTimeout(alertMessage.timer);
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
	},
		cb(){
		    				vari.alertBox.innerHTML ='';
		vari.alertBox.classList.remove(type);
		}
	    });
	},2000);
	    }
    });
}
//ɾ����ť

function createPrompt(type){
    const {prompt} =vari; 
    prompt.className = 'prompt show';
    prompt.innerHTML =` 
          <div class="${type}">
      <h4>ȷ��ɾ��</h4>
      <div class="main-prompt">
	<div>
	  	  ȷ��Ҫ����ѡ�ļ��������վ��
	</div>
	<div>
	  ɾ���ļ�����10����ͨ������վ��ԭ
	</div>
	<div class="btn-confirm">
	  <div class="btn-submit btn">ȷ��</div>
	  <div class="btn-cancel btn">ȡ��</div>
	</div>
      </div>
      <div class="vip-ad">
	<span><i></i>��ͨ������Ա�������վ30�챣����Ȩ</span>
	<div class="vip-sign-btn"><a href="https://pan.baidu.com/buy/center?tag=8&form=deletefile">������ͨ</a></div>
      </div>
    </div>
    `;
    return prompt;
}
function deleteFile(newOn){
    const submit = document.querySelector('.delete-box .btn-submit');
    const cancel = document.querySelector('.delete-box .btn-cancel');
    const prompt = document.querySelector('.prompt');
    // console.log(prompt.children);

    // if(target.classList.contains('btn-cancel')){
    // 	console.log('pro');
    // 	prompt.children.classList.remove('delete-box');
	
    // }
    if(newOn){//������½��ļ�
	const data= getSelectElement(vari.checkedBuffer);
	console.log(data);
	data.forEach(function(item){
	    item.fileNode.classList.remove('active');
	    vari.checkedBuffer = {length:0};
	});
	if(vari.checkAll.classList.contains('active')){
	     vari.checkAll.classList.remove('active');
	}
	return;
    }
    cancel.onclick = function(){
	prompt.classList.remove('show');
	prompt.innerHTML = '';
    };
    submit.onclick = function(){
	const data= getSelectElement(vari.checkedBuffer);
	console.log(data);
	data.forEach(function(item){
	    let file = item.fileNode;
	    	    item.fileNode.classList.remove('active');
	    file.parentNode.removeChild(file);
	    vari.checkedBuffer = {length:0};
	    deleteDataById(dataBase,item.fileId);
	    // console.log(dataBase);
	    // console.log(checkedBuffer);
	});
	if(vari.checkAll.classList.contains('active')){
	     vari.checkAll.classList.remove('active');
	}
	prompt.classList.remove('show');
	prompt.innerHTML = '';
    };
}

//�½��ļ���
function createFolder(){
        let newFolder = {
	    id: Date.now(),
	    name: '�½��ļ���'};
    const newFile = createFileNode(newFolder);

    const newData =vari.conRow.children[0];
    if(newData){
	console.log(newData);
	vari.conRow.insertBefore(newFile,newData);
    }else{
	vari.conRow.appendChild(newFile);
    }
    deleteFile(true);
    	setFileTitle(newFile);
}





