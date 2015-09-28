/***************************************  
JS��ʹ��sort���localeCompareʵ����������ʵ��
***************************************/  
/*
sort ���������ڶ������������
arrayobj.sort(sortfunction)
����
arrayObj ��ѡ����� Array ����
sortFunction ��ѡ�������ȷ��Ԫ��˳��ĺ��������ơ�������������ʡ�ԣ���ôԪ�ؽ����� ASCII �ַ�˳������������С�

���� < �� > �����Ӧ�õ������ַ���ʱ��sort����ֻ���ַ��� Unicode ����Ƚ��ַ������������ǵ��ص�������������ַ������ɵ�˳��һ������ȷ�ġ���localeCompare() �����ṩ�ıȽ��ַ����ķ�����������Ĭ�ϵı����������

localeCompare ����������һ��ֵ��ָ���ڵ�ǰ�����������������ַ����Ƿ���ͬ��
stringVar.localeCompare(stringExp)
����
stringVar ��ѡ�һ�� String ��������֡�
stringExp ��ѡ����� stringVar ���бȽϵ��ַ�����
����ֵ
��� stringVar ������ stringExp ֮ǰ����ô localeCompare ���� �C1��
��� stringVar ������ stringExp ֮���򷵻� +1��
�������ֵΪ 0���Ǿ�˵���������ַ�������ͬ�ġ�
*/

function sortArray(){
		var arrayTest = ["z", 5, 2, "a", 32, 3];
		// Ĭ�������sort()������ʹArray�е����鰴��ASCII���˳��������У����׳���
		arrayTest.sort();
		alert(arrayTest.toString());     //output:2,3,32,5,a,z
		// ���鵹��ķ���reverse()��
		arrayTest.reverse();
		alert(arrayTest.toString());    //output:z,a,5,32,3,2
}
sortArray();
 
/**
* �ȽϺ���
* @param {Object} param1 Ҫ�ȽϵĲ���1
* @param {Object} param2 Ҫ�ȽϵĲ���2
* @return {Number} ���param1 > param2 ���� 1
*                     ���param1 == param2 ���� 0
*                     ���param1 < param2 ���� -1
*/
function compareFunc(param1,param2){
		//�������������Ϊ�ַ�������
		if(typeof param1 == "string" && typeof param2 == "string"){
				return param1.localeCompare(param2);
		}
		//�������1Ϊ���֣�����2Ϊ�ַ���
		if(typeof param1 == "number" && typeof param2 == "string"){
				return -1;
		}
		//�������1Ϊ�ַ���������2Ϊ����
		if(typeof param1 == "string" && typeof param2 == "number"){
				return 1;
		}
		//�������������Ϊ����
		if(typeof param1 == "number" && typeof param2 == "number"){
				if(param1 > param2) return 1;
				if(param1 == param2) return 0;
				if(param1 < param2) return -1;
		}
}

/**
localeCompare()�������÷����÷����Ƕ��ַ�����������ķ�����ֻ��һ��������Ҫ�Ƚϵ��ַ�����
����˵������:
1�����String��������ĸ˳�����ڲ����е��ַ���֮ǰ�����ظ���
2�����String�������ַ�˳�����ڲ����е��ַ���֮�󣬷�������
3�����String������ڲ����е��ַ�������0
����֮�⣬localeCompare()��������һ������֮�����������֮���������䷽��ǩ��locale(�ֳ�������)�ϵ������֣�Ҳ����˵����ʵ��ʱ���������������ģ�
	�����Ӣ����ϵ�У�����ʵ�ֿ����ǰ����ַ�������
	����ں����У�����ʵ�����ǰ�������ĸ��ƴ����
*/

var testArray = ["��","��","֮","��"];
document.write(testArray.sort(
		function compareFunction(param1,param2){
				return param1.localeCompare(param2);  //output:֮,��,��,��
		}
));

function startSort(){
		testArray.sort();
		testArray.sort(function(a,b){return a.localeCompare(b)});//����ƴ�����򷽷�
}

var testArray3 = [
    {
        "name": "��Ѽ�",
        "index": 0
    },
    {
        "name": "�ɼ���",
        "index": 1
    },
    {
        "name": "����SD",
        "index": 3
    },
    {
        "name": "APPʵ",
        "index": 4
    },
    {
        "name": "�ָ߰�",
        "index": 5
    },
    {
        "name": "ȫ����",
        "index": 6
    },
    {
        "name": "������",
        "index": 7
    },
    {
        "name": "���͹���",
        "index": 8
    },
    {
        "name": "appdsa",
        "index": 4
    }
];
testArray2.sort(function(a,b){return a.name.localeCompare(b.name)});

