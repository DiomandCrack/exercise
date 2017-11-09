
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

//生成文件夹节点
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
    createFileList(db,currentId);
    createBreadCrumb(db,currentId);
    
}

//单选
function showCheckNode(checkNode){
    const allFiles  = vari.conRow.children;
    const targetParent = checkNode.parentNode.parentNode; //点击的元素的父级的父级 能改变文件夹激活样式的容器
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
//删除按钮

function createPrompt(type){
    const {prompt} =vari; 
    prompt.className = 'prompt show';
    prompt.innerHTML =` 
          <div class="${type}">
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





