
const vari ={

    conRow:document.querySelector('.container .row'),
    container:document.querySelector('.container'),
    breadCrumbNav:document.querySelector('.bread-crumb'),
    currentId:0,
    checkAll:document.querySelector('.check-all i'),
    checkedBuffer:{
	length:0
    }
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
                        <div class="file-title">${fileData.name}</div>
                        <div class="rename">
                            <input name="" type="text" value="${fileData.name}" />
                            <div class="yes"></div>
                            <div class="no"></div>
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
let currentId =0;
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
    }else{
	vari.checkedBuffer = {length:0};
		[...allFiles].forEach(function (item){
	    item.classList.remove('active');
	});
    }
}

//添加事件
vari.container.addEventListener('click',function(e){
    const target = e.target;
    if(target.classList.contains('main-file') || target.classList.contains('grey-file') || target.classList.contains('file-title')){
	openFile(dataBase,vari.currentId = target.fileId);
    }
    console.log(target);
    if(target.classList.contains('file-true')){ //监听单选按钮
	showCheckNode(target);
    }
    if(target.parentNode.classList.contains('check-all')){
	checkAllNode(target);
    }

    console.log(vari.checkedBuffer);
    
});

vari.breadCrumbNav.addEventListener('click',function(e){
    const target = e.target;
    if(target.fileId !==undefined && vari.cuurentId !== target.fileId){
	openFile(dataBase,vari.currentId = target.fileId);
    }
});
