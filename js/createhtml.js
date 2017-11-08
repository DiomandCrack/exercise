
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
    prompt:document.createElement('div')
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
    console.log(fileItems[0].fileld);
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

    const targetParent = checkNode.parentNode.parentNode; //点击的元素的父级的父级 能改变文件夹激活样式的容器
    
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

// 全选按钮节点
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
vari.btnRename.addEventListener('click',function(){
    const {checkedBuffer} = vari;
    const length = checkedBuffer.length;
    setFileTitle(checkedBuffer);
    right.removeEventListener('click',renameRule);
    wrong.removeEventListener('click',toggleWrong);
});

vari.deleteBtn.addEventListener('click',function(e){
    let target = e.target;
    vari.body.insertBefore(createPrompt('delete-box'),vari.alertBox);
    deleteFile(target);
});
//重命名
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
    //监听重命名规则事件函数
    function renameRule(){
		 shade.style.transform = '';
	let newName = nameInput.value.trim();	
	if(!newName){
	    nameInput.focus();
	    return alertMessage('文件(夹)名称不能为空，请输入文件名称','error');
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
	alertMessage('修改名字成功','success');
	switchName(nameText,nameChange,'show');
    }
//关闭按钮规则函数
    function toggleWrong(){
	 shade.style.transform = '';
	console.log(1);
	switchName(nameText,nameChange,'show');
    }
    
    right.addEventListener('click',renameRule);
  
    wrong.addEventListener('click',toggleWrong);
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
		fileId: key,
		fileNode: currentItem
	    });
	}
    }
    return data;
}

//提示框
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
function deleteFile(target){
    const {checkedBuffer} = vari;
    const submit = document.querySelector('.delete-box .btn-submit');
    const cancel = document.querySelector('.delete-box .btn-cancel');
    const prompt = document.querySelector('.prompt');
    // console.log(prompt.children);

    // if(target.classList.contains('btn-cancel')){
    // 	console.log('pro');
    // 	prompt.children.classList.remove('delete-box');
	
    // }
	console.log(checkedBuffer);
    cancel.onclick = function(){
	prompt.classList.remove('show');
	prompt.innerHTML = '';
    };
    submit.onclick = function(){
	const data= getSelectElement(checkedBuffer);
	data.forEach(function(item){
	    const file = item.fileNode;
	    file.parentNode.removeChild(file);
	    vari.checkedBuffer = {length:0};
	    deleteDataById(dataBase,item.fileId);
	    // console.log(dataBase);
	    // console.log(checkedBuffer);
	});
	prompt.classList.remove('show');
	prompt.innerHTML = '';
    };

    
}




