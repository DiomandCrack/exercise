

createChildren(dataBase,0);
clickFile(dataBase);

function createChildren(db,id){
    let children = getChildrenById(db,id);
    let fileStr = '';
    vari.conRow.innerHTML = '';
    for(let i=0; i<children.length;i++){
	let file = document.createElement('div');
	file.className = 'col-1';
	vari.conRow.appendChild(file);
	 fileStr =`<div class="file-con">
                               <i class="true"></i>
                        <div class="file">
                            <div class="grey-file"></div>
                            <div class="main-file"></div>
                        </div>
                        <div class="file-title">${children[i].name}</div>
                        <div class="rename">
                            <input name="" type="text" value="${children[i].name}" />
                            <div class="yes"></div>
                            <div class="no"></div>
                        </div>
                    </div>
                    `;
	file.innerHTML += fileStr;
	file.fileId = children[i].id;
    }
        if(!fileStr) {
	vari.conRow.innerHTML = '没有文件';
	return;
    }
}


function clickFile(db){
    const cols =  document.querySelectorAll('.row .col-1');
    //console.log(cols);
    const breadCrumbNav = document.querySelector('.bread-crumb');
    for(let i=0; i<cols.length; i++){
	cols[i].addEventListener('click',function(){
	    thisCrumb = document.createElement('li');
	    breadCrumbNav.appendChild(thisCrumb);
	    thisCrumb.innerHTML = `>${db[this.fileId].name}`;
	    thisCrumb.fileId = this.fileId;
	createChildren(db,this.fileId);
	clickFile(db);
    });
}
}

function clickCrumb(){

}



