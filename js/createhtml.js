
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
    repeat:1,
    copyTo: document.querySelector('.copy-to'),
    moveTo: document.querySelector('.move-to'),
    moveTargetId:0
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

//�ƶ��ļ���
vari.moveTo.addEventListener('click',function(e){
    if(!len){
	return;
    }

    
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
          <div class="prompt-box ${type}">
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
//�����ʾ�ļ�Ϊ��
function showEmpty(){
	vari.emptyInfo.classList.toggle('show', !vari.conRow.children.length);
}
//�ӵ�ǰ�����ҵ������Ӽ� �����Ӽ����Ӽ� ��������

// function findSonsTree(db,id){
//     let arr = [];
//     for(let key in db){
// 	const current = db[key];
// 	arr.push(current);
//     }
//     console.log(arr);
//     let data = [];
//     let level = 0;
//     function cycle(arr,id,level){
//     	for(var i=0; i<arr.length; i++){
// 	    const item = arr[i];
// 	    if(item.pId ==id){
// 		item.level = level;
// 		data.push(item);
// 		cycle(arr,item.id,level+1);
// 	    }
// 	}
//     };
//     cycle(arr,id,level);
//     return data;
// }

// console.log(findSonsTree(dataBase,2));
//���ɲ˵��ڵ�
// function createTreeList(db,id){
//     const menu = document.querySelector('.main-prompt .menu');
//     menu.style.width = '100%';
//     const tree = findSonsTree(db,id);

//     let temp = [];

//     for(let i=0; i<tree.length; i++){
// 	const data = tree[i];
// 	  let str = `<ul>`;
  
//   str += `<li>
//             <div data-file-id="${data.id}" style="padding-left: ${(data.level)*18}px;">
//               <i data-file-id="${data.id}" class="icon"></i>
//               <span data-file-id="${data.id}" class="name">${data.name}</span>
//             </div>`;

//   if(data.level){
//       str += createTreeList(db,id);
//     }
  
//     str += `</li></ul>`;
//     console.log(temp.join(''));
//     console.log(menu);
//     menu.innerHTML = str;
//     }
// }
// createTreeList(dataBase,0);

function createTreeList(db, id = 0, currentId){
  const data = db[id];
  let floorIndex = getAllParen(db, id).length;
  let children = getChildrenById(db, id);
    let  len = children.length;

  let str = `<ul>`;
  
  str += `<li>
            <div data-file-id="${data.id}" class="${currentId === data.id ? 'active' : ''}" style="padding-left: ${(floorIndex-1)*18}px;">
              <i data-file-id="${data.id}" class="icon"></i>
              <span data-file-id="${data.id}" class="name">${data.name}</span>
            </div>`;

  if(len){
      for(let i=0; i<len; i++){
    console.log(children[i].id);
      str += createTreeList(db, children[i].id,currentId);
    }
  }
  
    return str += `</li></ul>`;
}
const menu = document.querySelector('.prompt .menu');
menu.innerHTML = createTreeList(dataBase,vari.currentId);


// function createFileMoveDialog(treeListHtml,text){
//     const {prompt} =vari; 
//     prompt.className = 'prompt show';
//   file.innerHTML = `<div class="prompt show">
//       <div class="infinity-menu prompt-box">
// 	<h4>${text}</h4>
// 	<div class="menu-con main-prompt">
// 	  <div class="menu">
// 	    ${treeListHtml}
// 	  </div>
// 	</div>
// 	<div class="btn-group">
// 	  <div class="create-folder btn-small">
// 	    <i></i>�½��ļ���
// 	</div>
// 	<div class="submit btn-small">ȷ��</div>
// 	<div class="cancel btn-small">ȡ��</div>
//       </div>
//     </div>`;
//   return file;
// }

// function canMoveData(db, currentId, targetId){
//   const currentData = db[currentId];
  
//   const targetParents = getAllParents(db, targetId);
  
//   if(currentData.pId === targetId){
//     return 2; // �ƶ����Լ����ڵ�Ŀ¼
//   }
  
//   if(targetParents.indexOf(currentData) !== -1){
//     return 3;   // �ƶ����Լ����Ӽ�
//   }
//   if(!nameCanUse(db, targetId, currentData.name)){
//     return 4; // ���ֳ�ͻ
//   }
  
//   return 1;
// }

// function moveDataToTarget(db, currentId, targetId){
//   db[currentId].pId = targetId;
// }

// vari.moveTo.addEventListener('click', function (e){
//   const {checkedBuffer} = vari;
//   const len = checkedBuffer.length;
  
//   if(!len){
//     return alertMessage('��δѡ���ļ�', 'error');
//   }
  
//   setMoveFileDialog(sureFn, cancelFn);
  
//   function sureFn(){
//     const {conRow} = vari;
//     const checkedEles = getSelectElement(checkedBuffer);
    
//     let canMove = true;
    
//     for(let i=0, len=checkedEles.length; i<len; i++){
//       const {fileId, fileNode} = checkedEles[i];
//       const ret = canMoveData(db, fileId, vari.moveTargetId);
//       if(ret === 2){
//         return alertMessage('�Ѿ��ڵ�ǰĿ¼', 'error');
//         canMove = false;
//       }
//       if(ret === 3){
//         return alertMessage('�����ƶ����Ӽ�', 'error');
//         canMove = false;
//       }
//       if(ret === 4){
//         return alertMessage('����ͬ���ļ�', 'error');
//         canMove = false;
//       }
//     }
//     if(canMove){
//       checkedEles.forEach(function(item, i) {
//         const {fileId, fileNode} = item;
//         moveDataToTarget(db, fileId, wy.moveTargetId);
//         fsContainer.removeChild(fileNode.parentNode);
//       });
//       initCheckedFiles();
//       showEmptyInfo();
//     }
//   }
//   function cancelFn(){
//       alertMessage('ȡ���ƶ��ļ�', 'normal');
//   }
// });

// function setMoveFileDialog(sureFn, cancelFn){
//   const {fsDialog, currentListId} = vari;
  
//   const treeListNode = createFileMoveDialog(createTreeList(db, 0, currentListId));
  
//   fsDialog.appendChild(treeListNode);
  
//   fsDialog.classList.add('show');
  
//   const fileMoveWrap = document.querySelector('.file-move');
  
//   fileMoveWrap.style.left = (fileMoveWrap.parentNode.clientWidth - fileMoveWrap.offsetWidth) / 2 + 'px'; 
//   fileMoveWrap.style.top = (fileMoveWrap.parentNode.clientHeight - fileMoveWrap.offsetHeight) / 2 + 'px'; 
  
//   dragEle({
//     downEle: fsDialog.querySelector('.modal-header'),
//     moveEle: fsDialog.querySelector('.file-move')
//   });
  
//   const listTreeItems = document.querySelectorAll('#fsListTree div');
  
//   let prevActive = currentListId;
  
//   for(let i=0, len=listTreeItems.length; i<len; i++){
//     listTreeItems[i].onclick = function (){
//       listTreeItems[prevActive].classList.remove('active');
//       this.classList.add('active');
//       prevActive = i;
//       wy.moveTargetId = this.dataset.fileId * 1;
//     };
    
//     listTreeItems[i].firstElementChild.onclick = function (){
//       const allSiblings = [...this.parentNode.parentNode.children].slice(1);
      
//       if(allSiblings.length){
//         allSiblings.forEach(function(item, i) {
//           item.style.display = item.style.display === '' ? 'none' : '';
//         });
//       }
//       this.classList.toggle('glyphicon-folder-open');
//       this.classList.toggle('glyphicon-folder-close');
//     };
//   }
  
//   const sureBtn = fsDialog.querySelector('.sure');
//   const cancelBtn = fsDialog.querySelector('.cancel');
//   const closeBtn = fsDialog.querySelector('.close');
  
//   sureBtn.onclick = function (){
//     sureFn&&sureFn();
//     closeTreeList();
//   };
//   cancelBtn.onclick = closeBtn.onclick = function (e){
//     cancelFn&&cancelFn();
//     closeTreeList();
//   };
//   closeBtn.onmousedown = function (e){
//     e.stopPropagation();
//   };
  
//   function closeTreeList(){
//     fsDialog.classList.remove('show');
//     fsDialog.innerHTML = '';
//   }
// }



