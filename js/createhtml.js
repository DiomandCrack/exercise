
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
                       <i class="fa fa-check true"  aria-hidden="true"></i>
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
	for(let i=0; i<fileItems.length; i++){
	    fileItems[i].fileId = fileData.id;
	}
    file.fileId = fileData.id;
    console.log(fileItems[0].fileld);
    return file;
}

//生成面包屑导航节点
function createBreadCrumbNode(fileData){
    const crumbList = document.createElement('li');
    const href = document.createElement('a');

    href.fileId = fileData.id;
    href.innerHTML = `<i>&gt;</i> ${fileData.name}`;
    href.href = 'javascript:;';
    crumbList.appendChild(href);
    return crumbList;
}

function createFileList(db,id){
    vari.conRow.innerHTML = '';
    let children = getChildrenById(db,id);
    vari.fileNum = children.length;
    children.forEach(function(item,i){
	vari.conRow.appendChild(createFileNode(item));
    });
}


function createBreadCrumb(db,id){
    vari.breadCrumbNav.innerHTML = '';
    var data = getAllParen(db,id);
    data.forEach(function(item,i){
	vari.breadCrumbNav.appendChild(createBreadCrumbNode(item));
    });
    
}
let currentId =0;
openFile(dataBase,vari.currentId);

function openFile(db,currentId){
    createFileList(db,currentId);
    createBreadCrumb(db,currentId);
}

function showCheckNode(checkNode){

    const targetParent = checkNode.parentNode.parentNode;
    console.log(targetParent);
    const {fileId} = targetParent;
    const checked = targetParent.classList.toggle('active');

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
    console.log(length++);
    
    checkAll.classList.toggle('active',checkedBuffer.length===vari.fileNum);
    
};

vari.conRow.addEventListener('click',function(e){
    const target = e.target;
    if(target.classList.contains('main-file') || target.classList.contains('grey-file') || target.classList.contains('file-title')){
	openFile(dataBase,vari.currentId = target.fileId);
    }

    if(!target.classList.contains('active')){
	showCheckNode(target);
    }
});

vari.breadCrumbNav.addEventListener('click',function(e){
    const target = e.target;
    if(target.fileId !==undefined && vari.cuurentId !== target.fileId){
	openFile(dataBase,vari.currentId = target.fileId);
    }
});
