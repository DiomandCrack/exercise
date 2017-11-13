
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
    moveTargetId:0,
    menuOnFile: document.querySelector('.click-menu'),
    menuOnWhite: document.querySelector('.menu-on-white'),
    emptyInfo: document.querySelector('.show-empty')
};

//生成文件夹节点
function createFileNode(fileData){
    let file = document.createElement('div');
    file.className = 'col-1';
    file.innerHTML =`<div class="file-con" data-p-id="${fileData.pId}" data-name="${fileData.name}">
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
    //把数据中的id赋值给文件夹的每一个组成部分
    for(let i=0; i<fileItems.length; i++){
	fileItems[i].fileId = fileData.id;
    }
    file.fileId = fileData.id;

    return file;//返回整个文件夹节点
}

//生成面包屑导航节点
function createBreadCrumbNode(fileData){
    const crumbList = document.createElement('li');
    const href = document.createElement('a');

    href.fileId = fileData.id;
    href.innerHTML = `<i>&gt;</i> ${fileData.name}`;//生成面包屑导航html
    href.href = 'javascript:;';
    crumbList.appendChild(href);
    return crumbList;
}

//生成文件夹
function createFileList(db,id){
    vari.conRow.innerHTML = '';
    let children = getChildrenById(db,id);
    vari.childrenAll = children;
    vari.fileNum = children.length;
    children.forEach(function(item,i){
	vari.conRow.appendChild(createFileNode(item));
    });
}

//生成面包屑导航
function createBreadCrumb(db,id){
    vari.breadCrumbNav.innerHTML = '';
    var data = getAllParen(db,id);
    data.forEach(function(item,i){
	vari.breadCrumbNav.appendChild(createBreadCrumbNode(item));
    });

}

openFile(dataBase,vari.currentId);

//将生成文件夹和导航绑定在一起
function openFile(db,currentId){
    vari.menuOnFile.style.transform = 'scale(0)';
    vari.menuOnFile.style.display = 'none';
    createFileList(db,currentId);
    createBreadCrumb(db,currentId);
    menuOnFile(true);
    menuOnWhite();
    showEmpty();
}

//单选
function showCheckNode(checkNode){
    const allFiles  = vari.conRow.children;
    let targetParent;
    targetParent = checkNode.parentNode.parentNode;//点击的元素的父级的父级 能改变文件夹激活样式的容器
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
    checkAll.classList.toggle('active',checkedBuffer.length===length && length);
};

// 全选按钮节点
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

//显示副控制按钮
function showSubNav(){
    const length = vari.checkedBuffer.length;
    if(length>=1){
	vari.offlineDownload.style.display ='none';
	vari.subNav.style.display = 'flex';
    }else{
	vari.offlineDownload.style.display='block';
	vari.subNav.style.display = 'none';
    }

    vari.btnRename.classList.toggle('disable',length !==1);
}

//添加事件
vari.container.addEventListener('click',function(e){
    const target = e.target;
    if(target.classList.contains('main-file') || target.classList.contains('grey-file') || target.classList.contains('file-title')){
	openFile(dataBase,vari.currentId = target.fileId);
    }
    // console.log(target);
    if(target.classList.contains('file-true')){ //监听单选按钮
	showCheckNode(target);
	showSubNav();
    }
    if(target.parentNode.classList.contains('check-all')){//监听全选按钮
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
//监听删除按钮
vari.deleteBtn.addEventListener('click',function(e){
    let target = e.target;
    vari.body.insertBefore(createPrompt('delete-box'),vari.alertBox);
    deleteFile();
});
//监听新建按钮
vari.createNewFile.addEventListener('click',function(e){
    createFolder();
    showEmpty();
});


//重命名

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
    //监听重命名规则事件函数
    function renameRule(){
	shade.style.transform = '';
	let newName = nameInput.value.trim();	
	if(!newName){
	    nameInput.focus();
	    return alertMessage('文件(夹)名称不能为空，请输入文件名称','error');
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
    //关闭按钮规则函数
    function toggleWrong(){
	shade.style.transform = '';
	if(!boolean){
	    vari.conRow.removeChild(vari.conRow.children[0]);
	    console.log(1);
	}
	showEmpty();
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

//重命名共用函数
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
	alertMessage('修改名字成功','success');
    }else{
	alertMessage('创建文件成功','success');
    }
}
//input和title切换显示隐藏函数
function switchName(show,hidden,classType){
    show.classList.add(classType);
    hidden.classList.remove(classType);
}
//将选中的元素缓存转成数组
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

//提示框
function alertMessage(text,type){
    clearTimeout(alertMessage.timer);
    vari.alertBox.innerHTML= text;
    vari.alertBox.classList.add(type);
    animation({
	el:vari.alertBox,
	attrs:{
	    top: 75
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
	    },1000);
	}
    });
}
//删除按钮

function createPrompt(type){
    const {prompt} =vari; 
    prompt.className = 'prompt show';
    prompt.innerHTML =` 
	 <div class="prompt-box ${type}">
     <h4>确认删除</h4>
     <div class="main-prompt">
       <div>
		 确认要把所选文件放入回收站吗？
       </div>
       <div>
	 删除文件可在10天内通过回收站还原
       </div>
       <div class="btn-confirm">
	 <div class="btn-submit btn">确定</div>
	 <div class="btn-cancel btn">取消</div>
       </div>
     </div>
     <div class="vip-ad">
       <span><i></i>开通超级会员立享回收站30天保存特权</span>
       <div class="vip-sign-btn"><a href="https://pan.baidu.com/buy/center?tag=8&form=deletefile">立即开通</a></div>
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
    if(newOn){//如果是新建文件
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
	showEmpty();
    };
}

//新建文件夹
function createFolder(){
    let newFolder = {
	id: Date.now(),
	name: '新建文件夹'};
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
//如果显示文件为空
function showEmpty(){
    vari.emptyInfo.classList.toggle('show', !vari.conRow.children.length);
}
//从当前容器找到所有子级 包括子级的子级 // function findSonsTree(db,id){
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
function createTreeList(db, id = 0, currentId){
    const data = db[id];
    let floorIndex = getAllParen(db, id).length;
    let children = getChildrenById(db, id);
    let  len = children.length;

    let str = `<ul>`;

    str += `<li>
	  <div data-file-id="${data.id}" class="${currentId === data.id ? 'active' : ''} li-title" style="padding-left: ${(floorIndex)*10}px;">
	    <i data-file-id="${data.id}" class="file open">
			  <div class="grey-file"></div>
			  <div class="main-file"></div>
		      </i>
	    <span data-file-id="${data.id}" class="name">${data.name}</span>
	  </div>`;

    if(len){
	for(let i=0; i<len; i++){
	    // console.log(children[i].id);
	    str += createTreeList(db, children[i].id,currentId);
	}
    }

    return str += `</li></ul>`;
}

function createFileMoveDialog(treeListHtml,text){
    const {prompt} =vari; 
    prompt.className = 'prompt show';
    prompt.innerHTML = `
    <div class="infinity-menu prompt-box">
      <h4>${text}</h4>
      <div class="menu-con main-prompt">
	<div class="menu">
	  ${treeListHtml}
	</div>
      </div>
      <div class="btn-group">
	<div class="create-folder btn-small">
	  <i></i><span>新建文件夹</span>
      </div>
      <div class="submit btn-small">确定</div>
      <div class="cancel btn-small">取消</div>
    </div>`;
    return prompt;
}


// function canMoveData(db,checkedBuffer,currentId,targetId){
//     const data = getSelectElement(checkedBuffer);
//     const targetParents = getAllParen(db, targetId);
//     const index = []; 
//     const intoSelf = data.every(function(item){
// 	return item.pId === targetId;
//    });

//     if(intoSelf){
//     return -1; // 移动到自己所在的目录
//     }

//    const intoParent = data.every(function(item){
// 	return targetParents.indexOf(item) !== -1;
//    });

//     if(intoParent){
//     return -2;   // 移动到自己的子集
//     }

//     const nameRepeat = data.every(function(item){
// 	return nameConflict(db,targetId,item.name);
//     });

//     if(!nameRepeat){
//     return -3; // 名字冲突
//     }

//     return 1;  
// }
function moveToTarget(db,currentId, targetId){
    const data = getSelectElement(vari.checkedBuffer);
    console.log(vari.checkedBuffer);
    console.log(data);
    data.forEach(function(item){
	db[item.fileId].pId = targetId;
    });
}

vari.moveTo.addEventListener('click',moveToTargetFile);

function moveToTargetFile(e){
    mouseDraw(false);
    setMoveFileDialog(sureFn, cancelFn);
    const {checkedBuffer} = vari;
    const data = getSelectElement(checkedBuffer);


    const len = checkedBuffer.length;

    if(!len){
	return alertMessage('尚未选中文件', 'error');
    }

    function sureFn(){
	const {conRow} = vari;
	const {checkedBuffer} = vari;
	const targetParents = getAllParen(dataBase, vari.moveTargetId);
	let canMove = true;
	const intoSelf = data.every(function(item){
	    return item.fileNode.children[0].dataset.pId*1 === vari.moveTargetId;
	});

	if(intoSelf){
	    canMove = false;
	    return alertMessage('已经在当前目录', 'error'); // 移动到自己所在的目录
	}

	let parentArr = [];
	targetParents.forEach(item=>parentArr.push(item.id));
	console.log(data,parentArr);
	intoParent = data.find(function(item){

	    return parentArr.indexOf(item.fileId*1) !==-1;
	});


	if(intoParent){
	    canMove = false;
	    return alertMessage('不能移动到子级', 'error'); // 移动到自己的子级
	}

	const nameRepeat = data.every(function(item){
	    console.log(item.fileNode.children[0].dataset.name);
	    return nameConflict(dataBase,vari.moveTargetId,item.fileNode.children[0].dataset.name);
	});
	if(!nameRepeat){
	    canMove = false;
	    return  alertMessage('存在同名文件', 'error');
	    // 名字冲突
	}
	if(canMove){
	    data.forEach(function(item, i) {
		const {fileId, fileNode} = item;
		moveToTarget(dataBase, fileId, vari.moveTargetId);
		vari.conRow.removeChild(fileNode);
	    });
	    showEmpty();
	    initFresh();
	}
    }
    function cancelFn(){
	alertMessage('取消移动文件', 'normal');
    }
}

function setMoveFileDialog(sureFn, cancelFn){
    const {currentId} = vari;  
    const fileMoveWrap = document.querySelector('.file-move');
    const treeListNode = createFileMoveDialog(createTreeList(dataBase, 0, vari.currentId),'移动到');
    vari.body.insertBefore(treeListNode,vari.alertBox);  dragEle({
	downEle: vari.prompt.querySelector('.prompt h4'),
	moveEle: vari.prompt.querySelector('.prompt-box')
    });


    const listTreeItems = document.querySelectorAll('.prompt .li-title');
    let prevActive = currentId;
    const len=listTreeItems.length;  
    for(let i=0; i<len; i++){
	listTreeItems[i].onclick = function (){
	    // listTreeItems[prevActive].classList.remove('active');
	    // prevActive = i;
	    [...listTreeItems].forEach(function(item){
		item.classList.remove('active');
	    });
	    this.classList.add('active');
	    console.log(this.dataset.fileId);
	    vari.moveTargetId = this.dataset.fileId * 1;
	};

	listTreeItems[i].firstElementChild.onclick = function (){
	    const allSiblings = [...this.parentNode.parentNode.children].slice(1);
	    if(allSiblings.length){
		allSiblings.forEach(function(item, i) {
		    item.style.display = item.style.display === '' ? 'none' : '';
		});
	    }
	    this.classList.toggle('open');
	};
    }

    const submitBtn = vari.prompt.querySelector('.submit');
    const cancelBtn = vari.prompt.querySelector('.cancel');
    // const closeBtn = fsDialog.querySelector('.close');

    submitBtn.onclick = function (){
	sureFn&&sureFn();
	closeTreeList();

    };
    cancelBtn.onclick = function (e){
	closeTreeList();
    };

    // closeBtn.onmousedown = function (e){
    //   e.stopPropagation();
    // };
}

function closeTreeList(){
    vari.prompt.classList.remove('show');
    vari.prompt.innerHTML = '';
    initFresh();
}

function initFresh(){
    vari.checkedBuffer = {length: 0};
    vari.checkAll.classList.remove('active');
    vari.fileNum=0;
    const fileChildren = vari.conRow.children;
    [...fileChildren].forEach(function(item){
	item.classList.remove('active');
    });
    vari.offlineDownload.style.display='block';
    vari.subNav.style.display = 'none';
}

//鼠标画框
//     vari.container.addEventListener('mousedown',function(e){
mouseDraw(true);
//     });

// function mouseDraw(e){
//     const children = vari.conRow.children;


// 	initFresh();
// 	e.preventDefault();

// 	if(e.target.classList.contains('item')){
// 	    return;
// 	}

// 	const frame = document.createElement('div');

// 	frame.className = 'frame';

// 	vari.body.insertBefore(frame,vari.alertBox);

// 	const startX = e.pageX;
// 	const startY = e.pageY;

// 	function frameMove(e){
// 	    let x = e.pageX;
// 	    let y = e.pageY;

// 	    let l = Math.min(x,startX);
// 	    let t = Math.min(y,startY);
// 	    let w = Math.abs(x - startX);
// 	    let h = Math.abs(y - startY);

// 	    for(let i=0; i<children.length; i++){
// 		if(duang(frame,children[i])){
// 		    children[i].classList.add('active');
// 		    vari.checkedBuffer[children[i].fileId] = children[i];
// 		    vari.checkedBuffer.length =getSelectElement(vari.checkedBuffer).length ;
// 		    if(vari.checkedBuffer.length>=1){
// 			vari.offlineDownload.style.display ='none';
// 			vari.subNav.style.display = 'flex';
// 		    }else{
// 			vari.offlineDownload.style.display='block';
// 			vari.subNav.style.display = 'none';

// 		    }
// 		    console.log(vari.checkedBuffer);
// 		}else{
// 		    children[i].classList.remove('active');
// 		}
// 	    }

// 	    vari.btnRename.classList.toggle('disable',length !==1);

// 	    if(vari.checkedBuffer.length == children.length){
// 		vari.checkAll.classList.add('active');
// 	    }else{
// 		vari.checkAll.classList.remove('active');
// 	    }

// 	    frame.style.left = l + 'px';
// 	    frame.style.top = t +'px';
// 	    frame.style.width = w + 'px';
// 	    frame.style.height = h + 'px';
// 	}

// 	vari.container.addEventListener('mousemove',frameMove);
// 	vari.body.addEventListener('mouseup', cancelFrame);

// 	console.log(frame.parentNode);
// 	function cancelFrame(e){
// 	    frame.style.transform = 'scale(0)';
// 	    vari.container.removeEventListener('mousemove',frameMove);
// 	    vari.container.removeEventListener('mouseup',cancelFrame);
// 	}

// 	// console.log(children[0].fileId);
// }

function mouseDraw(ban){

    const children = vari.conRow.children;
    vari.body.onmousedown = function (e){
	e.preventDefault();
	if(e.target.classList.contains('col-1') || e.target.classList.contains('nav-bar')||e.target.classList.contains('check-all') ||e.target.classList.contains('count-load-file')){
	    return;
	}
	const frame = document.createElement('div');
	frame.className = 'frame';
	document.body.appendChild(frame);
	const startX = e.pageX;
	const startY = e.pageY;
	document.onmousemove = function (e){
	    let x = e.pageX, y = e.pageY;

	    const l = Math.min(x, startX);
	    const t = Math.min(y, startY);
	    const w = Math.abs(x - startX);
	    const h = Math.abs(y - startY);
	    for(var i=0; i<children.length; i++){
		if(duang(frame, children[i])){
		    children[i].classList.add('active');
		    vari.checkedBuffer[children[i].fileId] = children[i];
		    vari.checkedBuffer.length =getSelectElement(vari.checkedBuffer).length ;
		    if(vari.checkedBuffer.length>=1){
			vari.offlineDownload.style.display ='none';
			vari.subNav.style.display = 'flex';
		    }else{
			vari.offlineDownload.style.display='block';
			vari.subNav.style.display = 'none';

		    }

		}
	    }

	    vari.btnRename.classList.toggle('disable',vari.checkedBuffer.length !==1);

	    if(vari.checkedBuffer.length ===  children.length && children.length){
		vari.checkAll.classList.add('active');
	    }else{
		vari.checkAll.classList.remove('active');
	    }
	    frame.style.left = l + 'px';
	    frame.style.top = t + 'px';
	    frame.style.width = w + 'px';
	    frame.style.height = h + 'px';
	};
	document.onmouseup = function (e){
	    document.body.removeChild(frame);
	    this.onsmoueup = this.onsmouemove = null;
	};

    };
}


//右键菜单

function menuOnFile(onFile){
	const menu = vari.menuOnFile;
	[...vari.conRow.children].forEach(function(item){

	    item.addEventListener('contextmenu',function(e){
		e.stopPropagation();
		e.preventDefault();
		initFresh();
		item.classList.add('active');
		vari.checkedBuffer[item.fileId] = item;
		vari.checkedBuffer.length=1;
		// item.children[0].dataset
		showSubNav();
		vari.menuOnWhite.style.display = 'none';
		vari.menuOnWhite.style.transform = 'scale(0)';
		menu.fileId = item.fileId;
		console.log(menu.fileId);
		let x = e.pageX;
		let y = e.pageY;
		menu.style.display='flex';
		menu.style.transform='scale(1)';
		if(window.innerWidth-x<menu.offsetWidth){
		    x= window.innerWidth - menu.offsetWidth;
		    
		}

		if(x < vari.container.offsetLeft){
		    x = vari.container.offsetLeft;
		}

		if(window.innerHeight-y<menu.offsetHeight){
		    y = window.innerHeight - menu.offsetHeight;
		}

		menu.style.left = x + 'px';
		menu.style.top = y + 'px';

	    });

	    contextMenuFunction(onFile);
	});
    document.addEventListener('click',function(e){
	menu.style.display='none';
	menu.style.transform = 'scale(0)';
    });
}

//右键菜单的功能
function contextMenuFunction(onFile){
	let menu;
    if(onFile){
	menu = vari.menuOnFile;
	const open = menu.querySelector('.open');
	const move = menu.querySelector('.move');
	const rename = menu.querySelector('.rename');
	const menuDelete = menu.querySelector('.delete');

	open.onclick = function(){
	    openFile(dataBase,menu.fileId);
	};
	move.onclick = function(e){
	    moveToTargetFile(e);
	};
	rename.onclick = function(e){
	    permitRename();
	};
	menuDelete.onclick = function(e){
	    let target = e.target;
	    vari.body.insertBefore(createPrompt('delete-box'),vari.alertBox);
	    deleteFile();
	};
    }else{
	menu = vari.menuOnWhite;
	const newFolder = menu.querySelector('.creat-new-folder');
	const fresh = menu.querySelector('.fresh');
	const sort = menu.querySelector('.sort');
	const change = menu.querySelector('.change-list');

	fresh.onclick = function(){
	    initFresh();
	};
	
    }
}
//在空白处的菜单
function menuOnWhite(){
    const menu = vari.menuOnWhite;
    const sort = menu.querySelector('.sub-list');
    const change = menu.querySelector('.sub-change-list');
    vari.container.addEventListener('contextmenu',function(e){
	console.log(e.target.fileId);
	e.preventDefault();
	initFresh();
	let x = e.pageX;
	let y = e.pageY;
	menu.style.display='flex';
	menu.style.transform='scale(1)';
	if(e.target.fileId){
	    vari.menuOnWhite.style.display = 'none';
	    vari.menuOnWhite.style.transform = 'scale(0)';
	}else{
	    vari.menuOnFile.style.display = 'none';
	    vari.menuOnFile.style.transform = 'scale(0)';
	    if(window.innerWidth-x<menu.offsetWidth){
		x= window.innerWidth - menu.offsetWidth;
		change.style.left = '-5.15rem';
		sort.style.left ='-5.15rem';
	    }else{
		change.style.left = '';
		sort.style.left ='';
	    }

	    if(x < vari.container.offsetLeft){
		x = vari.container.offsetLeft;
	    }

	    if(window.innerHeight-y<menu.offsetHeight){
		y = window.innerHeight - menu.offsetHeight;
	    }

	    menu.style.left = x + 'px';
	    menu.style.top = y + 'px';
	}
    });
        document.addEventListener('click',function(e){
	menu.style.display='none';
	menu.style.transform = 'scale(0)';
    });
}
