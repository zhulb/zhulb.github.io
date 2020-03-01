(function($){
	var idindex=2;
	function create_toc(data,target,pid,path){
		pid=null==pid?0:pid;
		path=null==path?'':path;
		var curFolderId=(idindex++);
		target.push({
			'id'	:	curFolderId,
			'pId'	:	pid,
			'name'	:	null==data.folderName?"md":data.folderName,
			'open'	:	true
		});
		for(var i=0;i<data.folderlist.length;i++){

			create_toc(data.folderlist[i],target,curFolderId,path+"/"+data.folderlist[i].folderName);
		}
		var base=getBaseUrl();
		for(var i=0;i<data.mdlist.length;i++){
			var curMdId=(idindex++);
			target.push({
				'id'	:	curMdId,
				'pId'	:	curFolderId,
				'name'	:	data.mdlist[i].name,
				'url'	:	base+path+"/"+data.mdlist[i].name,
				'open'	:	true
			});
			for(var j=0;j<data.mdlist[i].headerlist.length;j++){
				var curHeaderId=(idindex++);
				target.push({
					'id'	:	curHeaderId,
					'pId'	:	curMdId,
					'name'	:	data.mdlist[i].headerlist[j],
					'url'	:	base+path+"/"+data.mdlist[i].name+"#"+data.mdlist[i].headerlist[j].replace(/ *?#* */,'')+".cont",
					'open'	:	true
				});

			}
		}
	}
	/*
	 * 渲染ztree
	 */	
	function render_with_ztree(opts) {
		var t = $(opts._zTree);
		var zTreeObj=$.fn.zTree.init(t,opts.ztreeSetting,opts._header_nodes);
		t = zTreeObj.expandAll(opts.is_expand_all);

		// alert(opts._headers * 88);
		// $(opts._zTree).height(opts._headers  * 33 + 33);
		
		$(opts._zTree).css(opts.ztreeStyle);
	}
	$.fn.ztree_directory_toc = function(options) {
		// 将defaults 和 options 参数合并到{}
		var opts = $.extend({},$.fn.ztree_directory_toc.defaults,options);
		return this.each(function() {
			opts._zTree = $(this);
			
			// 创建table of content，获取元数据_headers
			var base=getBaseUrl();;
			opts.data.unshift(opts._header_nodes[0]);//Table of Content
			opts._header_nodes=opts.data;
			for(var i=1;i<opts._header_nodes.length;i++){
				if(opts._header_nodes[i]['isDir']){
					opts._header_nodes[i]['url']='';
				}
				else{
					opts._header_nodes[i]['url']=base+opts._header_nodes[i]['url'];
				}
			}
			//create_toc(opts.data,opts._header_nodes);
			
			// 根据_headers生成ztree
			render_with_ztree(opts);

		});
		// each end
	}
	//定义默认
	$.fn.ztree_directory_toc.defaults = {
		_zTree: null,
		_headers: [],
		_header_offsets: [],
		_header_nodes: [{ id:-1, pId:-1, name:"目录",open:true}],
		debug: true,
		highlight_offset: 0,
		highlight_on_scroll: true,
		/*
		 * 计算滚动判断当前位置的时间，默认是50毫秒
		 */
		refresh_scroll_time: 50,
		documment_selector: 'body',
		is_posion_top: false,
		/*
		 * 默认是否显示header编号
		 */
		is_auto_number: true,
		/*
		 * 默认是否展开全部
		 */	
		//is_expand_all: true,
		/*
		 * 是否对选中行，显示高亮效果
		 */	
		is_highlight_selected_line: true,
		step: 100,
		ztreeStyle: {
			width:'260px',
			overflow: 'auto',
			position: 'fixed',
			'z-index': 2147483647,
			border: '0px none',
			left: '0px',
			bottom: '0px',
			// height:'100px'
		},
		ztreeSetting: {
			view: {
				dblClickExpand: false,
				showLine: true,
				showIcon: false,
				selectedMulti: false
			},
			data: {
				simpleData: {
					enable: true,
					idKey : "id",
					pIdKey: "pId",
					// rootPId: "0"
				}
			},
			callback: {
				beforeClick: function(treeId, treeNode) {

				},
				onRightClick: function(event, treeId, treeNode) {

				},
				onClick: function(event, treeId, treeNode){

				}
			}
		}
	};
})(jQuery)