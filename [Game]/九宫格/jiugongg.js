
/**
 * Created by cshao on 12/28/14.
 */

function getPermutation(arr) {
  if (arr.length == 1) {
    return [arr];
  }

  var permutation = [];
  for (var i=0; i<arr.length; i++) {
    var firstEle = arr[i];
    var arrClone = arr.slice(0);
    arrClone.splice(i, 1);
    var childPermutation = getPermutation(arrClone);
    for (var j=0; j<childPermutation.length; j++) {
      childPermutation[j].unshift(firstEle);
    }
    permutation = permutation.concat(childPermutation);
  }
  return permutation;
}

function validateCandidate(candidate) {
  var sum = candidate[0] + candidate[1] + candidate[2];
  for (var i=0; i<3; i++) {
    if (!(sumOfLine(candidate,i)==sum && sumOfColumn(candidate,i)==sum)) {
      return false;
    }
  }
  if (sumOfDiagonal(candidate,true)==sum && sumOfDiagonal(candidate,false)==sum) {
    return true;
  }
  return false;
}
function sumOfLine(candidate, line) {
  return candidate[line*3] + candidate[line*3+1] + candidate[line*3+2];
}
function sumOfColumn(candidate, col) {
  return candidate[col] + candidate[col+3] + candidate[col+6];
}
function sumOfDiagonal(candidate, isForwardSlash) {
  return isForwardSlash ? candidate[2]+candidate[4]+candidate[6] : candidate[0]+candidate[4]+candidate[8];
}

var permutation = getPermutation([1,2,3,4,5,6,7,8,9]);
var candidate;
for (var i=0; i<permutation.length; i++) {
  candidate = permutation[i];
  if (validateCandidate(candidate)) {
    break;
  } else {
    candidate = null;
  }
}
if (candidate) {
  console.log(candidate);
} else {
  console.log('No valid result found');
}