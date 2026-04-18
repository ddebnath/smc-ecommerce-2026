/*
    Description: This function takes a file object and converts it to a data URI format using the DataURIParser library. 
    It extracts the file extension from the original file name and uses it to format the data URI. The resulting data URI
    is returned as a string.
    
    Parameters:
        - file: An object representing the file to be converted. It should have an 'originalname' property containing
        the original file name and a 'buffer' property containing the file data as a buffer.
    
        Returns:
        - A string representing the data URI of the file.   
*/

import DataURIParser from "datauri/parser.js";
import path from "path";

const parser = new DataURIParser();

const getDataUri = (file) => {
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer).content;
};

export default getDataUri;
